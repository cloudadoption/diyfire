/** Conditionally loads and runs dynamic blocks (e.g. tabs from section metadata). */
export default async function dynamicBlocks(main) {
  const hasTabSections = main?.querySelectorAll('.section[data-tab-id]').length > 0;
  if (hasTabSections) {
    const { createTabs } = await import('./tabs/tabs.js');
    createTabs(main);
  }
}
