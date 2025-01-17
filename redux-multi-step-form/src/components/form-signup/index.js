import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { formStage, formSignup } from '../../store/rootSlice';
import './styles.scss';

function FormUserSignup({ pageTitle, submitButtonText, previousButton }) {

  // redux
  const dispatch = useDispatch();

  // get Redux store values for formUserSignup
  const currentStage = useSelector(state => state.FormStage); // for previous button
  const formstageName = useSelector(state => state.FormUserSignup.name);
  const formstageNABHID = useSelector(state => state.FormUserSignup.NABHID);
  const formstageEmail = useSelector(state => state.FormUserSignup.email);
  const formstagePass = useSelector(state => state.FormUserSignup.password);

  // form values initial state
  const [formData, setFormData] = useState({
    name: formstageName || "",
    NABHID: formstageNABHID || "",
    email: formstageEmail || "",
    password: formstagePass || "",
  });

  // form values onchange
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData, 
      [name]: value
    });
  };

  // form validation checks
  const [errors, setErrors] = useState({});
  const validate = (formData) => {
    let formErrors = {}; // set form errors to none at start

    // name
    if (!formData.name) {
      formErrors.name = "Name required";
    }

    // NABHID
    if (!formData.NABHID) {
      formErrors.NABHID = "NABH ID required";
    }

    // email
    const emailRegex = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    if (!formData.email || !emailRegex.test(formData.email)) {
      formErrors.email = 'Valid Email required';
    }

    // password
    const passwordRegex = new RegExp('(?=.*[a-z])+(?=.*[A-Z])+(?=.*[0-9])+(?=.{10,})');
    if (!formData.password || !passwordRegex.test(formData.password)) {
      formErrors.password = 'The minimum password length is 10 characters and must contain at least 1 lowercase letter, 1 uppercase letter and 1 number.';
    }

    return formErrors;
  };

  const [isSubmitted, setIsSubmitted] = useState(false); // state for sent status

  // onsubmit
  const handleSubmit = (e) => {
    e.preventDefault(); // stop form submission
    setErrors(validate(formData)); // check errors
    setIsSubmitted(true); // update submit status
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitted) { // check if any form errors

      // update Redux Slice
      dispatch(
        formStage(2) // update formStage
      );
      dispatch(
        formSignup({ // update formSignup
          name: formData.name,
          NABHID: formData.NABHID,
          email: formData.email,
          password: formData.password
        })
      );
    }

  }, [formData, isSubmitted, dispatch, errors]);

  return (
    <>
      <h2>{pageTitle || 'Signup'}</h2>
          
      <form 
        name="form-signup"
        id="form-signup"
        onSubmit={(e) => handleSubmit(e)}
      >
      
        <p>
          <label htmlFor="name">Hospital Name<span className="required-asterix">*</span></label>
          <input 
            type="text"
            id="name" 
            name="name" 
            autoComplete="name" 
            aria-label="name"
            aria-required="true"
            placeholder="Hospital name"
            value={formData.name}
            onChange={handleChange}
          />
        </p>
        {errors.name && <span className="error-message">{errors.name}</span>}

        <p>
          <label htmlFor="NABHID">NABH ID<span className="required-asterix">*</span></label>
          <input 
            type="text"
            id="NABHID" 
            name="NABHID" 
            autoComplete="NABHID" 
            aria-label="NABHID"
            aria-required="true"
            placeholder="NABH ID"
            value={formData.NABHID}
            onChange={handleChange}
          />
        </p>
        {errors.NABHID && <span className="error-message">{errors.NABHID}</span>}

        <p>
          <label htmlFor="email">Hospital email<span className="required-asterix">*</span></label>
          <input 
            type="email" 
            id="email" 
            name="email"
            autoComplete="email" 
            aria-label="email"
            aria-required="true"
            placeholder="email@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </p>
        {errors.email && <span className="error-message">{errors.email}</span>}

        <p>
          <label htmlFor="password">Password<span className="required-asterix">*</span></label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            aria-label="password"
            aria-required="true"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
          />
        </p>
        {errors.password && <span className="error-message">{errors.password}</span>}

        <p className="disclaimer-text"><span className="required-asterix">*</span> required fields</p>

        <div className="btn-array">
          {(previousButton) && 
            <p>
              <input 
                type="submit" 
                value={`Back`}
                onClick={() => dispatch(formStage(currentStage - 1))}
              />
            </p>
          }
          <p>
            <input 
              type="submit" 
              value={submitButtonText || 'Submit'} 
            />
          </p>
        </div>

      </form>
    </>
  );
}

export default FormUserSignup;


