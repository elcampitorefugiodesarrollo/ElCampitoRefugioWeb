import {
  POST_DOG,
  POST_USER,
  GET_CLOUDINARY_RESPONSE,
  CLEAR_CLOUDINARY_RESPONSE,
  GET_USERS,
  GET_DOGS,
  GET_DOGS_DETAILS,
  CLEAR_DETAILS,
  CLEAR_ALL_DOGS,
  FILTER_DOGS_BY_GENDER,
  FILTER_DOGS_BY_AGE,
  FILTER_DOGS_BY_SIZE,
  GET_PRESS,
  POST_MELI,
  GET_USERS_EMAIL,
  POST_ADOPTION,
  POST_CONTACTO,
  POST_VOLUNTEER,
  GET_PROYECTOS,
  VERIFY_CAPTCHA,
  DELETE_CAPTCHA_VALIDATE,
} from '../actions/types';

const initialState = {
  dogs: [],
  user: {},
  detailsDogs: [],
  allUsers: [],
  allDogs: [],
  press: [],
  responseCloudinary: '',
  userEmail: [],
  userProfile: [],
  slider: [],
  proyectos: [],
  validateRecaptcha: {},
};

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        allUsers: action.payload,
      };
    case GET_DOGS:
      return {
        ...state,
        dogs: action.payload,
        allDogs: action.payload,
      };
    case GET_DOGS_DETAILS:
      return {
        ...state,
        detailsDogs: action.payload,
      };
    case CLEAR_DETAILS:
      return {
        detailsDogs: [],
      };

    case CLEAR_ALL_DOGS:
      return {
        allDogs: [],
      };

    case POST_DOG:
      return {
        ...state,
        dog: action.payload,
      };
    case POST_USER:
      return {
        ...state,
        dog: action.payload,
      };
    case POST_MELI:
      return {
        ...state,
      };
    case GET_CLOUDINARY_RESPONSE:
      const link = action.payload;
      return {
        ...state,
        responseCloudinary: link,
      };

    case CLEAR_CLOUDINARY_RESPONSE:
      return {
        ...state,
        responseCloudinary: '',
      };

    case FILTER_DOGS_BY_GENDER:
      const filtredByGender = state.allDogs;
      const dogsFiltered =
        action.payload === 'All'
          ? filtredByGender
          : filtredByGender.filter((el) => el.gender === action.payload);
      if (dogsFiltered.length === 0) {
        alert('No se encontraron perros con ese filtro');
        return {
          ...state,
          dogs: filtredByGender,
        };
      } else {
        return {
          ...state,
          dogs: dogsFiltered,
        };
      }

    case FILTER_DOGS_BY_AGE:
      const filtredByAge = state.allDogs;
      const dogsFilteredByAge =
        action.payload === 'All'
          ? filtredByAge
          : filtredByAge.filter((el) => el.age === action.payload);
      if (dogsFilteredByAge.length === 0) {
        alert('No se encontraron perros con ese filtro');
        return {
          ...state,
          dogs: filtredByAge,
        };
      } else {
        return {
          ...state,
          dogs: dogsFilteredByAge,
        };
      }
    case FILTER_DOGS_BY_SIZE:
      const filtredBySize = state.allDogs;
      const dogsFilteredBySize =
        action.payload === 'All'
          ? filtredBySize
          : filtredBySize.filter((el) => el.size === action.payload);
      if (dogsFilteredBySize.length === 0) {
        alert('No se encontraron perros con ese filtro');
        return {
          ...state,
          dogs: filtredBySize,
        };
      } else {
        return {
          ...state,
          dogs: dogsFilteredBySize,
        };
      }
    case GET_PRESS:
      return {
        ...state,
        press: action.payload,
      };
    case GET_USERS_EMAIL:
      return {
        ...state,
        userEmail: action.payload,
      };
    case POST_CONTACTO:
      return {
        ...state,
      };
    case POST_ADOPTION:
      return {
        ...state,
      };
    case POST_VOLUNTEER:
      return {
        ...state,
      };
    case 'GET_USERS_PROFILE':
      return {
        ...state,
        userProfile: action.payload,
      };
    case 'GET_SLIDER':
      return {
        ...state,
        slider: action.payload,
      };
    case GET_PROYECTOS:
      return {
        ...state,
        proyectos: action.payload,
      };
    case VERIFY_CAPTCHA:
      console.log('llegamos al reducer captcha');
      return {
        ...state,
        validateRecaptcha: action.payload,
      };
    case DELETE_CAPTCHA_VALIDATE:
      return {
        ...state,
        validateRecaptcha: {},
      };
    default:
      return {
        ...state,
      };
  }
}
