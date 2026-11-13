// unity-managed: sha256=08807c76e4103f245007538900446b39b3951c4c0951dbe9c72f55824315e682
// OpenCode plugin for Unity CLI (instalación a nivel de carpeta).
// Copia local de `unity setup opencode`. OpenCode carga automáticamente
// todo archivo en .opencode/plugins/ al iniciar. Borra este archivo para quitarlo.
//
// When a session starts it runs `unity skill sync opencode --hook` in the
// background. If that changed any Unity skill, it shows a toast and adds the
// change to the session as context, without asking the model to reply. Any
// failure is ignored: the session never waits on this plugin.
/** @param {{ client: any, $: any }} input */
export const UnitySkills = async ({ client, $ }) => {
  /** @param {string | undefined} sessionID */
  const sync = async (sessionID) => {
    try {
      const out = await $`unity skill sync opencode --hook --format json`.quiet().nothrow().text();
      const data = JSON.parse(out)?.data;
      if (!data || !Array.isArray(data.changed) || data.changed.length === 0) {
        return;
      }
      await client.tui.showToast({
        body: {
          message: `Unity skills updated: ${data.changed.join(', ')}`,
          variant: 'info',
        },
      });
      if (sessionID && typeof data.message === 'string' && data.message) {
        await client.session.prompt({
          path: { id: sessionID },
          body: {
            noReply: true,
            parts: [{ type: 'text', text: data.message }],
          },
        });
      }
    } catch (_) {
      // `unity` missing, not JSON, or the TUI is not attached: nothing to do.
    }
  };

  return {
    /** @param {{ event: any }} input */
    event: async ({ event }) => {
      if (event.type !== 'session.created') return;
      const session = event.properties?.info;
      // A subagent's session starts inside one that already synced.
      if (session?.parentID) return;
      void sync(session?.id);
    },
  };
};
