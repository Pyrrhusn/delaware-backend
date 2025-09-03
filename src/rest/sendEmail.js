// routes/emailRoutes.js
const Router = require("@koa/router");

const { sendEmail } = require("../service/sendEmail");

  const sendEmailHandler = async (ctx) => {
    const { bestelling } = ctx.request.body;
  
    try {
      await sendEmail(bestelling);  // de s wegdoen
      ctx.body = { success: true, message: 'Email sent' };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: ctx.request.body};
    }
  };
  


module.exports = (app) => {
  const router = new Router({ 
  });

  router.post(
    "/send-email", sendEmailHandler
  );

  app.use(router.routes()).use(router.allowedMethods());
};

