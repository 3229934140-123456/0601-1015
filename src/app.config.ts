export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/customers/index',
    'pages/visits/index',
    'pages/opportunities/index',
    'pages/profile/index',
    'pages/customer-detail/index',
    'pages/check-in/index',
    'pages/opportunity-detail/index',
    'pages/quote-detail/index',
    'pages/contact-detail/index',
    'pages/messages/index',
    'pages/performance/index',
    'pages/visit-edit/index',
    'pages/route-plan/index',
    'pages/contact-edit/index',
    'pages/quote-edit/index',
    'pages/contacts/index',
    'pages/quotes/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '外勤CRM',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f5f6f7'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#165DFF',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '工作台'
      },
      {
        pagePath: 'pages/customers/index',
        text: '客户'
      },
      {
        pagePath: 'pages/visits/index',
        text: '拜访'
      },
      {
        pagePath: 'pages/opportunities/index',
        text: '商机'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})
