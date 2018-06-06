module.exports = {
  base: '/algorithm/',
  title: '算法',
  description: '算法与数据结构的学习',

  // 默认主题的配置
  themeConfig: {
    editLinks: true,
    docsDir: 'docs',

    nav: [
      { text: '中文', link: '/' },
      { text: '英文', link: '/en/' }
    ],

    sidebar: {
      '/en/': [
        {
          title: 'a star',
          collapsable: false,
          children: [
            ['/en/a-star-preface-en', 'bbb']
          ]
        }
      ],
      '/': [
        {
          title: 'A*算法',
          collapsable: false,
          children: [
            ['/a-star-preface', '概述'],
            ['/a-star-introduction', '介绍']
          ]
        }
      ]
    }
  }
}
