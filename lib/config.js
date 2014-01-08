/** local configuration */
exports.GoogleOAuth = {
  ClientID: '344637897208-f7p67hnrk1d7ov25i1ngh800cevi5t0q.apps.googleusercontent.com',
  ClientSecret: 'DoSXgzR_LfM0BZEogG_caaX7',
  RedirectURI: 'http://localhost:5000/oauth/oauth-callback',
  Scope: ["https://spreadsheets.google.com/feeds",
          "https://www.googleapis.com/auth/calendar",
          "https://www.googleapis.com/auth/drive"].join(" "),
  UserCredentials: {
    testeroonie: {
      access_token: '',
      refresh_token: '1/Bs1MPXbbViPtg1NzEFJ_31lWdLdStx28EBx1K5IfejA'
    }
  }
}