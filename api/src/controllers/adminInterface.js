const { interfacesModel } = require("models");

const adminInterface = async (req, res) => {
  try {
    const interfaz = await interfacesModel.find({});

    let aux = [];
    if (interfaz[0].slider && interfaz[0].slider.length > 0 ){
        interfaz[0].slider.forEach((i, index)=>{
        aux.push({ src: i || "", index: index })
      });
    };
        
    let newObj = {
      _id: interfaz[0]._id || "",
      imgVoluntarios: { src: interfaz[0].imgVoluntarios || "", index:99 },
      voluntarioText: interfaz[0].voluntarioText || "",
      escolarText: interfaz[0].escolarText || "",
      visitasText: interfaz[0].visitasText || "",
      colaboraText: interfaz[0].colaboraText || "",
      imgNosotros: { src: interfaz[0].imgVoluntarios || "", index:98 },
      homeText: interfaz[0].homeText || "",
      slider: aux || []
    };

    res.json([newObj]);
  } catch (error) {
    res.status(404).send({ error });
  }
};


const adminInterfaceId = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const interfaz = await interfacesModel.findById({ _id: id });

    let aux = [];
      if (interfaz.slider && interfaz.slider.length > 0 ){
        interfaz.slider.forEach((i, index)=>{
        aux.push({ src: i || "", index: index })
      });
    };
        
    let newObj = {
      _id: interfaz._id || "",
      imgVoluntarios: { src: interfaz.imgVoluntarios || "", index:99 },
      voluntarioText: interfaz.voluntarioText || "",
      escolarText: interfaz.escolarText || "",
      visitasText: interfaz.visitasText || "",
      colaboraText: interfaz.colaboraText || "",
      imgNosotros: { src: interfaz.imgVoluntarios || "", index:98 },
      homeText: interfaz.homeText || "",
      slider: aux || []
    };

    res.json(newObj);
  } catch (e) {
    res.status(404).send({ error: e });
  }
};

const adminCreateInterface = async (req, res) => {
  try {
    const { body } = req;
    
    const interfaces = await interfacesModel.create(body);
    res.status(200).send({ data: interfaces });
  } catch (e) {
    res.status(404).send({ error: e });
  }
};

const adminUpdateInterface = async (req, res) => {
  try {
    const {
      params: { id },
      body,
    } = req;

    let obj = {
      imgVoluntarios: body.imgVoluntarios,
      voluntarioText: body.voluntarioText,
      escolarText: body.escolarText,
      visitasText: body.visitasText,
      colaboraText: body.colaboraText,
      imgNosotros: body.imgNosotros,
      homeText: body.homeText,
      slider: body.slider
    };

    const interfaz = await interfacesModel.findByIdAndUpdate(
      { _id: id },
      obj,
      {
        returnOriginal: false,
      }
    );

    res.json({ data: interfaz });
  } catch (e) {
    res.status(404).send({ error: e });
  }
};

const adminDeleteInterface = async (req, res) => {
  try {
    const id = req.params.id;

    let borrado = await interfacesModel.findByIdAndUpdate(
      { _id: id },
      { isDelete: true },
      {
        returnOriginal: false,
      }
    );

    res.status(201).send(borrado);
  } catch (e) {
    res.status(404).send({ error: e });
  }
};


module.exports = {
    adminInterface,
    adminInterfaceId,
    adminUpdateInterface,
    adminCreateInterface,
    adminDeleteInterface
};
