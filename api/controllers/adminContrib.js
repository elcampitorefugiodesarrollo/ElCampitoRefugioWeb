const { contributionsModel, usersModel, dogModel } = require("../models/index");

const adminContrib = async (req, res) => {
  try {
    const range = JSON.parse(req.query.range);
    // const filtro = JSON.parse(req.query.filter);
    let rango = [Number(range[0]), Number(range[1] - range[0])];

    const contributions = await contributionsModel
      .find({}) //   isDelete: false 
      .populate("user dog", {
        _id: 1,
        name: 1,
      })
      .skip(rango[0])
      .limit(rango[1] + 1);

    const contributionMapping = contributions.map((c) => {
      let { user, dog, ...data } = c.toObject();

      if (user == undefined && dog == undefined) {
        return {
          name: "Anónimo",
          phone: " ",
          email: " ",
          nameDog: " ",
          idUser: " ",
          idDog: " ",
          ...data,
        };
      }

      if (user == {} && dog == {}) {
        return {
          name: "Anónimo",
          phone: " ",
          email: " ",
          nameDog: " ",
          idUser: " ",
          idDog: " ",
          ...data,
        };
      }

      if (user && dog == undefined) {
        return {
          name: user.name,
          phone: " ",
          email: " ",
          nameDog: " ",
          idUser: user._id,
          idDog: " ",
          ...data,
        };
      }

      if (user == undefined && dog) {
        return {
          nameDog: dog.name,
          name: " ",
          phone: " ",
          email: " ",
          idUser: " ",
          idDog: dog._id,
          ...data,
        };
      }
      data.date = data.date.toJSON().slice(0, 10);

      return {
        name: user.name,
        phone: user.phone || " ",
        email: user.email || " ",
        nameDog: dog.name,
        idUser: user._id,
        idDog: dog._id,
        ...data,
      };
    });

    res.status(201).send(contributionMapping);
  } catch (e) {
    res.status(404).send({ error: e });
  }
};

const adminContribId = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    console.log(id);

    const contributions = await contributionsModel
      .findById({ _id: id })
      .populate("user dog", {
        name: 1,
        _id: 1,
        phone: 1,
        email: 1,
      });

    const { user, dog, ...data } = contributions.toObject();
    data.date = data.date.toJSON().slice(0, 10);

    res.json({
      name: user?.name || " ",
      phone: user?.phone || " ",
      email: user?.email || " ",
      nameDog: dog?.name || " ",
      idUser: user?._id || undefined,
      idDog: dog?._id || undefined,
      ...data,
    });
  } catch (e) {
    res.status(404).send({ error: e });
  }
};

//-------------------------------------------------------------
const adminUpdateContrib = async (req, res) => {
  try {
    const {
      params: { id },
      body: { email, nameDog, name, phone, idUser, idDog, ...dataCont },
    } = req;

    // console.log(req.body)

    await contributionsModel.findByIdAndUpdate({ _id: id }, dataCont, {
      returnOriginal: false,
    });

    const contri = await contributionsModel
      .findById({ _id: id })
      .populate("user dog");

    const { user, dog, ...data } = contri.toObject();

    res.json({
      data: {
        name: user.name,
        nameDog: dog.name,
        idUser: user._id || undefined,
        idDog: dog._id || undefined,
        phone: user.phone || " ",
        email: user.email || " ",
        ...data,
      },
    });
  } catch (e) {
    res.status(404).send({ error: e });
  }
};

//---------------------------------------------------------------

const adminCreateContrib = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    const { email, nameDog, type, name, ...dataContibution } = data;

    // console.log(email); console.log(nameDog);  console.log(dataContibution);

    let newCertificate = {},
      certificateSee = {},
      userDb = {},
      myDog = {},
      rol = [],
      myGodParent = [];

    if (nameDog) {
      myDog = await dogModel.findOne({ name: nameDog });
    }
    console.log(myDog);

    if (email) {
      userDb = (await usersModel.findOne({ email: email })) || undefined;
      console.log("linea 169", userDb);
      console.log(email);
      if (userDb === undefined) {
        if (name) {
          userDb = await usersModel.create({ email, name });
        } else {
          userDb = await usersModel.create({ email });
        }
      }
    }
    console.log("linea 178", userDb);

    if (!nameDog) {
      if (!email) {
        newCertificate = await contributionsModel.create({
          type,
          ...dataContibution,
        });
        certificateSee = await contributionsModel.findById({
          _id: newCertificate._id,
        });
        console.log(certificateSee);

        return res.status(201).send({
          data: {
            name: "",
            idUser: null,
            phone: "",
            email: "",
            dog: "",
            idDog: null,
            ...certificateSee._doc,
          },
        });
      }

      if (type === "sponsoreo" && email) {
        newCertificate = await contributionsModel.create({
          type,
          user: userDb._id,
          ...dataContibution,
        });

        rol = userDb.roles?.find((r) => r === "sponsor") || undefined;
        userDb.roles = userDb.roles || [];
        if (!rol || rol !== "sponsor")
          userDb.roles = [...userDb.roles, "sponsor"];
        userDb.contribution = [...userDb.contribution, newCertificate._id];
        // await userDb.save();
        await usersModel.findByIdAndUpdate(
          { _id: userDb._id },
          { contribution: userDb.contribution, roles: userDb.roles },
          {
            returnOriginal: false,
          }
        );
      }
      if (type === "donación" && email) {
        newCertificate = await contributionsModel.create({
          type,
          user: userDb._id,
          ...dataContibution,
        });
        console.log("linea 77");

        rol = userDb.roles?.find((r) => r === "donante") || undefined;
        userDb.roles = userDb.roles || [];
        if (!rol || rol !== "donante")
          userDb.roles = [...userDb.roles, "donante"];
        userDb.contribution = [...userDb.contribution, newCertificate._id];
        // await userDb.save();
        await usersModel.findByIdAndUpdate(
          { _id: userDb._id },
          { contribution: userDb.contribution, roles: userDb.roles },
          {
            returnOriginal: false,
          }
        );
      }

      certificateSee = await contributionsModel
        .findById({ _id: newCertificate._id })
        .populate("user");

      const { user, ...dataCertificate } = certificateSee.toObject();

      return res.status(201).send({
        data: {
          name: user.name,
          idUser: user._id,
          phone: user.phone || "",
          email: user.email || "",
          nameDog: "",
          idDog: null,
          ...dataCertificate,
        },
      });
    }

    if (email && nameDog && type === "padrinazgo") {
      newCertificate = await contributionsModel.create({
        user: userDb._id,
        dog: myDog._id,
        type,
        ...dataContibution,
      });
      console.log(newCertificate);

      rol = userDb.roles?.find((r) => r === "padrino") || undefined;
      userDb.roles = userDb.roles || [];
      if (!rol || rol !== "padrino")
        userDb.roles = [...userDb.roles, "padrino"];
      userDb.contribution = [...userDb.contribution, newCertificate._id];
      // await userDb.save();
      await usersModel.findByIdAndUpdate(
        { _id: userDb._id },
        { contribution: userDb.contribution, roles: userDb.roles },
        {
          returnOriginal: false,
        }
      );

      myGodParent =
        myDog.godparents?.find((p) => p === userDb._id) || undefined;
      myDog.godparents = myDog.godparents || [];
      if (!myGodParent || myGodParent !== userDb._id) {
        myDog.godparents = [...myDog.godparents, userDb._id];
      }
      // await myDog.save();
      await dogModel.findByIdAndUpdate(
        { _id: myDog._id },
        { godparents: myDog.godparents },
        {
          returnOriginal: false,
        }
      );

      certificateSee = await contributionsModel
        .findById({ _id: newCertificate._id })
        .populate("user dog");

      const { user, dog, ...dataCertificate } = certificateSee.toObject();

      console.log(user);
      console.log(dog);

      // res.json("hecho")

      return res.status(201).send({
        data: {
          name: user.name,
          idUser: user._id,
          phone: user.phone || "",
          email: user.email || "",
          nameDog: dog.name,
          idDog: dog._id,
          ...dataCertificate,
        },
      });
    }
  } catch (error) {
    res.status(404).send({ error });
  }
};

const adminDeleteContrib = async (req, res) => {
  try {
    // const { body } = req;
    const id = req.params.id;

    console.log(id);

    const contributionDelete = await contributionsModel.findByIdAndUpdate(
      { _id: id },
      { isDelete: true },
      {
        returnOriginal: false,
      }
    );
    res.status(201).send(contributionDelete);
  } catch (e) {
    res.status(404).send(e);
  }
};

// const adminDeleteContrib = async (req, res) => {
//   try {

//     const id = req.params.id;
//     const { query: { filter} } = req;

//     if (!filter) {
//       let userDelete = await usersModel.findByIdAndUpdate({ _id: id }, { isDelete: true },
//         {
//           returnOriginal: false,
//         });

//       res.status(201).send(userDelete);

//     } else {

//       let { id } = JSON.parse(filter);
//       let listDeleteUsers = [];

//       for(let user of id){
//         let usersDeletes = await usersModel.findByIdAndUpdate({ _id: user }, { isDelete: true },
//           {
//             returnOriginal: false,
//           });
//         listDeleteUsers.push(usersDeletes)
//       }

//       res.status(200).send(listDeleteUsers)
//     }
//   } catch (e) {
//     res.status(404).send({ error: e });
//   }
// };

module.exports = {
  adminCreateContrib,
  adminDeleteContrib,
  adminContrib,
  adminUpdateContrib,
  adminContribId,
};
