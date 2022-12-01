export const signInEmail = (APPNAME: string, SIGNINURL: string) => `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" style="color-scheme: light dark; height: 100%">
  <head>
    <meta charset="utf-8">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings
            xmlns:o="urn:schemas-microsoft-com:office:office"
          >
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <style>
        td,
        th,
        div,
        p,
        a,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: "Segoe UI", sans-serif;
          mso-line-height-rule: exactly;
        }
      </style>
    <![endif]-->      <title>Sign In</title>
    <style>:root {
  color-scheme: light dark;
}
.hover-bg-fuchsia-500:hover {
  background-color: #d946ef !important;
}
.hover-text-decoration-underline:hover {
  text-decoration: underline;
}
@media (prefers-color-scheme: dark) {
  .dark-bg-black {
    background-color: #000 !important;
  }
  .dark-bg-slate-900 {
    background-color: #0f172a !important;
  }
  .dark-bg-black-20 {
    background-color: rgb(0 0 0 / 0.2) !important;
  }
  .dark-from-slate-900 {
    --tw-gradient-from: #0f172a !important;
    --tw-gradient-to: rgb(15 23 42 / 0) !important;
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;
  }
  .dark-to-fuchsia-700-20 {
    --tw-gradient-to: rgb(162 28 175 / 0.2) !important;
  }
  .dark-text-slate-200 {
    color: #e2e8f0 !important;
  }
  .dark-text-slate-50 {
    color: #f8fafc !important;
  }
}
@media (max-width: 600px) {
  .sm-w-full {
    width: 100% !important;
  }
  .sm-py-8 {
    padding-top: 32px !important;
    padding-bottom: 32px !important;
  }
  .sm-px-6 {
    padding-left: 24px !important;
    padding-right: 24px !important;
  }
  .sm-leading-8 {
    line-height: 32px !important;
  }
}</style>  </head>
  <body class="dark-bg-black" style="word-break: break-word; -webkit-font-smoothing: antialiased; margin: 0; height: 100%; width: 100%; background-color: #fff; padding: 0">      <div style="display: none">
        Sign in to ${APPNAME}
        &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
      </div>
    <div role="article" aria-roledescription="email" aria-label="Sign In" lang="en" style="height: 100%; width: 100%">    <table class="dark-from-slate-900 dark-to-fuchsia-700-20 dark-bg-slate-900" style="margin: auto; height: 100%; width: 100%; background-color: #f1f5f9; background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); --tw-gradient-from: #f8fafc; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); --tw-gradient-to: rgb(232 121 249 / 0.2); font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" class="dark-from-slate-900 dark-to-fuchsia-700-20 dark-bg-slate-900" style="background-color: #f1f5f9; background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); --tw-gradient-from: #f8fafc; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); --tw-gradient-to: rgb(232 121 249 / 0.2)">
          <table class="sm-w-full" style="margin: auto; width: 600px" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td class="sm-py-8 sm-px-6" style="padding: 48px; text-align: center">
                <a href="https://crudify.app">
                  <img src="https://crudify.app/favicon.png" style="border: 0; width: 64px; max-width: 100%; vertical-align: middle" alt="">
                </a>
              </td>
            </tr>
            <tr>
              <td align="center" class="sm-px-6">
                <table style="width: 100%" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td class="sm-px-6 dark-bg-black-20 dark-text-slate-200" style="border-radius: 12px; background-color: #fff; padding: 48px; text-align: left; font-size: 16px; font-weight: 500; line-height: 24px; color: #334155; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)">
                      <p class="sm-leading-8 dark-text-slate-50" style="margin: 0; margin-bottom: 24px; font-size: 24px; font-weight: 600; color: #000">
                        Sign In To ${APPNAME}
                      </p>
                      <div style="line-height: 100%">
                        <a href="${SIGNINURL}" class="hover-bg-fuchsia-500" style="text-decoration: none; display: inline-block; border-radius: 4px; background-color: #a21caf; padding-top: 16px; padding-bottom: 16px; padding-left: 32px; padding-right: 32px; text-align: center; font-size: 18px; font-weight: 600; color: #fff">
                          <!--[if mso]>
                            <i style="mso-text-raise: 30px; letter-spacing: 24px">&#8202;</i>
                          <![endif]-->
                          <span style="mso-text-raise: 16px">Sign In &rarr;</span>
                          <!--[if mso]>
                            <i style="letter-spacing: 24px">&#8202;</i>
                          <![endif]-->
                        </a>
                      </div>
                      <table role="separator" style="width: 100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-top: 32px; padding-bottom: 32px">
                            <div style="height: 1px; background-color: #e2e8f0; line-height: 1px">
                              &zwnj;
                            </div>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 0; margin-bottom: 16px">
                        If you didn't sign up for ${APPNAME}, you can safely
                        ignore this email.
                      </p>
                      <p style="margin: 0; margin-bottom: 16px">- Team ${APPNAME}</p>
                    </td>
                  </tr>
                  <tr role="separator">
                    <td style="height: 48px"></td>
                  </tr>
                  <tr>
                    <td style="padding-left: 24px; padding-right: 24px; text-align: center; font-size: 12px; color: #475569">
                      <p style="margin: 0; margin-bottom: 16px; text-transform: uppercase">
                        Powered by
                        <a href="https://crudify.app" class="hover-text-decoration-underline" style="text-decoration: none; color: #a21caf">Crudify</a>
                      </p>
                      <p style="margin: 0; font-style: italic">
                        Rapidly create your applications today
                      </p>
                      <p style="cursor: default">
                        Visit us on
                        <a href="https://github.com/nicolehollant/crudify" class="hover-text-decoration-underline" style="text-decoration: none; color: #a21caf">Github</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>    </div>
  </body>
</html>
`;
