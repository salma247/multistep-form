const router = require("express").Router();

const STEPS = [
  [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      required: true,
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
    },
    {
      name: "bio",
      label: "Bio",
      type: "multiline-text",
    },
  ],
  [
    {
      name: "country",
      label: "Country",
      type: "text",
      required: true,
    },
    {
      name: "receiveNotifications",
      label:
        "I would like to receive email notifications for new messages when I'm logged out",
      type: "yes-no",
      required: true,
    },
    {
      name: "receiveUpdates",
      label: "I would like to receive updates about the product via email",
      type: "yes-no",
      required: true,
    },
  ],
];

const methodNotAllowed = (req, res, next) => {
  return res.header("Allow", "GET").sendStatus(405);
};

const getOnboarding = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    return res.status(200).json({ steps: STEPS });
  } catch (error) {
    next(error);
  }
};

const saveOnboardingData = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const { steps } = req.body;

    if (!Array.isArray(steps) || steps.length !== STEPS.length) {
      return res.status(400).json({ error: "Invalid request body format." });
    }

    const userData = steps[0];
    const completedFlag = steps[1];


    //invalid feild name
    const fieldNames = userData.map(f => f.name).concat(completedFlag.map(f => f.name));
    const invalidFieldNames = fieldNames.filter(f => !STEPS[0].find(f2 => f2.name === f) && !STEPS[1].find(f2 => f2.name === f));
    if (invalidFieldNames.length > 0) {
      return res.status(400).json({ error: `Invalid field names: ${invalidFieldNames.join(", ")}` });
    }

    // Example validation: Ensure each field has name and value properties
    for (const field of userData) {
      if (!field.name || !field.value) {
        return res.status(400).json({ error: "Each field must have name and value." });
      }
    }

    // Example validation: Ensure each field has name and value properties
    for (const field of completedFlag) {
      if (!field.name || field.value === undefined) {
        return res.status(400).json({ error: "Each field must have name and value." });
      }
    }

    //if required fields are missing
    const requiredFieldsFirstStep = STEPS[0].filter(f => f.required).map(f => f.name);
    const requiredFieldsSecondStep = STEPS[1].filter(f => f.required).map(f => f.name);
    const missingRequiredFields = requiredFieldsFirstStep.filter(f => !userData.find(f2 => f2.name === f)).concat(requiredFieldsSecondStep.filter(f => !completedFlag.find(f2 => f2.name === f)));
    if (missingRequiredFields.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missingRequiredFields.join(", ")}` });
    }

    //if invalid data type
    const invalidDataTypes = [...STEPS[0], ...STEPS[1]].filter(f => {
      const allFields = userData.concat(completedFlag);
      if (f.type === "text" || f.type === "multiline-text") {
        return allFields.find(f2 => f2.name === f.name && typeof f2.value !== "string");
      }
      if (f.type === "yes-no") {
        return allFields.find(f2 => f2.name === f.name && typeof f2.value !== "boolean");
      }
      return false;
    });

    if (invalidDataTypes.length > 0) {
      return res.status(400).json({ error: `Invalid data types: ${invalidDataTypes.map(f => f.name).join(", ")}` });
    }

    //if extra property other than name and value
    const extraProperties = [...userData, ...completedFlag].filter(f => {
      return Object.keys(f).length > 2;
    });

    if (extraProperties.length > 0) {
      return res.status(400).json({ error: `Extra properties: ${extraProperties.map(f => f.name).join(", ")}` });
    }

    //database update (replace with your actual database logic)
    const user = {
      id: req.user.id,
      firstName: userData.find(f => f.name === "firstName").value,
      lastName: userData.find(f => f.name === "lastName")?.value || "",
      bio: userData.find(f => f.name === "bio")?.value || "",
      country: completedFlag.find(f => f.name === "country").value || "",
      receiveNotifications: completedFlag.find(f => f.name === "receiveNotifications").value || false,
      receiveUpdates: completedFlag.find(f => f.name === "receiveUpdates").value || false,
      completedOnboarding: true,
    };


    return res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      country: user.country,
      receiveNotifications: user.receiveNotifications,
      receiveUpdates: user.receiveUpdates,
      completedOnboarding: user.completedOnboarding,
    });
  } catch (error) {
    next(error);
  }
};

router.route("/").get(getOnboarding).post(saveOnboardingData).all(methodNotAllowed);

module.exports = router;