import bcrypt from 'bcryptjs';
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import config from '../config'
import { createApplicant,  deleteApplicantById, updateApplicantById, findAllApplicant, findApplicantById, findApplicantBySearchTerm, findAllApplicantLogin, deleteApplicantLogin } from "../models/applicant/applicant.query";
import { createApplicantLogin, findApplicantLoginData, findApplicantLoginByEmail } from "../models/applicantLogin/applicantLogin.query";


export async function postApplicant (req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    if (name && email && typeof name === 'string' && typeof email === 'string') {
      const loginCheck = await findApplicantLoginByEmail(email);
      if(!loginCheck) {
        const newApplicant = await createApplicant({
          name, 
          email
          });

        const salt = bcrypt.genSaltSync();
        const encryptedPassword = bcrypt.hashSync(password, salt);
        const loginData = {
          email,
          password: encryptedPassword,
          applicantId: newApplicant.id
        }
        await createApplicantLogin(loginData);
        res.status(201).send({ status: 'success', user: newApplicant });
      } else res.status(400).send({message: 'An account with this email already exists.'});
    } else res.status(400).json({message: 'Invalid applicant fields.'});
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}


export async function searchApplicant (req: Request, res: Response) {
  try {
      const search = req.query.q;
      const searchTerm = search?.toString();
  
      if (searchTerm) {
        const applicant = await findApplicantBySearchTerm(searchTerm);
        res.json({ data: applicant });
      } else res.json({ data: [] });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
}


export async function getAllApplicant (req: Request, res: Response) {
  try {
    const applicants = await findAllApplicant();
    res.json({ data: applicants });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

export async function getAllApplicantLogin (req: Request, res: Response) {
  try {
    const applicants = await findAllApplicantLogin();
    res.json({ data: applicants });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

export async function login (req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if ( typeof email === "string" && typeof password === "string") {
      const login = await findApplicantLoginByEmail(email);
      if (login) {
        if (bcrypt.compareSync(password, login.password)) {
          const applicant = await findApplicantById(login.applicantId);
          if (applicant) {
            const token = jwt.sign({ id: applicant.id, email: applicant.email}, config.JWT_SECRET, { expiresIn: '1h'})
            res.status(200).send({ status: 'success', applicant, token});
          } else res.status(400).send({ message: 'This is account is no longer in service.'})
        } else res.status(401).send({ message: 'Invalid password for this login.'})
      } else res.status(400).send({ message: 'There have been no accounts created with this email.' });
    } else res.status(400).send({ message: 'Invalid data.' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: (error as Error).message})
  }
}

export async function deleteApplicant(req: Request, res: Response) {
  const applicantId = Number(req.params.applicantId);
    try {
        const result = await deleteApplicantById(applicantId);

        if (result.success) {
          const loginData = await deleteApplicantLogin(applicantId)
            return res.status(200).json({ message: result.message });
        } else {
            return res.status(404).json({ message: result.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function updateApplicant(req: Request, res: Response) {
  const applicantId = parseInt(req.params.applicantId, 10);
  const updatedData = req.body; 

  try {
      const result = await updateApplicantById(applicantId, updatedData);

      if (result.success) {
          return res.status(200).json({ message: result.message });
      } else {
          return res.status(404).json({ message: result.message });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function deleteApplicantLoginData(req: Request, res: Response) {
  const applicantId = Number(req.params.applicantId);
    try {
        const result = await deleteApplicantLogin(applicantId);
        if (result.success) {
            return res.status(200).json({ message: result.message });
        } else {
            return res.status(404).json({ message: result.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function getApplicantLoginData(req: Request, res: Response) {
  const applicantId = Number(req.params.applicantId);
  try {
      const loginData = await findApplicantLoginData(applicantId);
      if (loginData) {
          return res.status(200).json({ data: loginData });
      } else {
          return res.status(404).json({ message: 'Applicant login data not found' });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function getApplicantById(req: Request, res: Response) {
  const applicantId = Number(req.params.applicantId);
  try {
    const applicantData = await findApplicantById(applicantId);
    if(applicantId) {
      return res.status(200).json({data: applicantData})
    } else {
      return res.status(404).json({ message: 'Applicant data not found'})
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function addExperience(req: Request, res: Response) {
  const applicantId = Number(req.params.applicantId);
  const updatedData = req.body;
  try {
    const existingApplicant = await findApplicantById(applicantId);
    if(existingApplicant && existingApplicant.experience && updatedData.experience) {
      updatedData.experience = [...existingApplicant.experience, ...updatedData.experience]
    } const result = await updateApplicantById(applicantId, updatedData);

    if (result.success) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(404).json({ message: result.message });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function addSkillTags(req: Request, res: Response) {
  const applicantId = Number(req.params.applicantId);
  const updatedData = req.body;
  try {
    const existingApplicant = await findApplicantById(applicantId);
    if(existingApplicant && existingApplicant.skillTags && updatedData.skillTags) {
      updatedData.skillTags = [...existingApplicant.skillTags, ...updatedData.skillTags]
    } const result = await updateApplicantById(applicantId, updatedData);

    if (result.success) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(404).json({ message: result.message });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function masterApplicant(req: Request, res: Response) {
  try {
    const applicantsData = req.body; // Assuming req.body is an array of applicant data
    const createdApplicants = [];

    for (const applicantData of applicantsData) {
      const { name, email, password } = applicantData;

      if (name && email && password && typeof name === 'string' && typeof email === 'string') {
        const loginCheck = await findApplicantLoginByEmail(email);
        
        if (!loginCheck) {
          const newApplicant = await createApplicant({ name, email });
          const salt = bcrypt.genSaltSync();
          const encryptedPassword = bcrypt.hashSync(password, salt);
          const loginData = {
            email,
            password: encryptedPassword,
            applicantId: newApplicant.id
          };
          await createApplicantLogin(loginData);
          createdApplicants.push(newApplicant);
        } else {
          // If account with email already exists, skip and continue with the next applicant
          console.log(`An account with email ${email} already exists. Skipping...`);
        }
      } else {
        console.log('Invalid applicant fields:', applicantData);
      }
    }

    res.status(201).send({ status: 'success', createdApplicants });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}
