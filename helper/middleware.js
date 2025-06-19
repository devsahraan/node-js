const jWT = require("jsonwebtoken")

  exports.verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];  //null undefine   false

     if (!token) return res.status(403).json({ error: "Access denied" });


      try {

      const decoded = jWT.verify(token, process.env.secretKey);
      req.user = decoded;

      next();

    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }

  }