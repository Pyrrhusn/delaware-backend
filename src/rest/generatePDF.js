// routes/generatePDFRoutes.js
const Router = require("@koa/router");

const { generatePDF } = require("../service/generatePDF");

  const generatePDFHandler = async (ctx) => {
    const { bestelling } = ctx.request.body;
  
    try {
      await generatePDF(bestelling);  // de s wegdoen
      ctx.body = { success: true, message: 'pdf generated' };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: ctx.request.body};
    }
  };
  


module.exports = (app) => {
  const router = new Router({ 
  });

  router.post(
    "/generatePDF", generatePDFHandler
  );

  app.use(router.routes()).use(router.allowedMethods());
};

