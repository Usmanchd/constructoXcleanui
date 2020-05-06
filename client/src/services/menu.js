export async function getLeftMenuData() {
  return [
    {
      title: 'Theme Settings',
      key: 'settings',
      icon: 'icmn icmn-cog utils__spin-delayed--pseudo-selector',
    },
    // {
    //   title: 'Documentation',
    //   key: 'documentation',
    //   url: 'https://docs.cleanuitemplate.com',
    //   target: '_blank',
    //   icon: 'icmn icmn-books',
    // },
    {
      divider: true,
    },
    {
      title: 'Dashboard',
      key: 'dashboard',
      url: '/dashboard',
      icon: 'icmn icmn-home',
    },
    {
      title: 'Project List',
      key: 'projectList',
      url: '/dashboard/list',
      icon: 'icmn icmn-list2',
    },
    {
      title: 'Add new Project',
      key: 'addNewProject',
      url: '/dashboard/project-details/create-project',
      icon: 'icmn icmn-plus',
    },
  ]
}
export async function getTopMenuData() {
  return [
    {
      title: 'Theme Settings',
      key: 'settings',
      icon: 'icmn icmn-cog utils__spin-delayed--pseudo-selector',
    },
    // {
    //   title: 'Docs',
    //   key: 'documentation',
    //   url: 'https://docs.cleanuitemplate.com',
    //   target: '_blank',
    //   icon: 'icmn icmn-books',
    // },
    {
      title: 'Dashboard',
      key: 'dashboard',
      url: '/dashboard',
      icon: 'icmn icmn-home',
    },
    {
      title: 'Project List',
      key: 'projectList',
      url: '/dashboard/list',
      icon: 'icmn icmn-list2',
    },
    {
      title: 'Add new Project',
      key: 'addNewProject',
      url: '/dashboard/project-details/create-project',
      icon: 'icmn icmn-plus',
    },
  ]
}
