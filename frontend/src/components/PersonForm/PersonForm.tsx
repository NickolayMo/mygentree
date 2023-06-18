import { memo, useCallback, ChangeEvent, FormEventHandler, FormEvent, useState } from 'react';
import classNames from 'classnames';
import type { Node, InfoNode } from '../../renderTree/types';
import css from './PersonForm.module.css';
import { getPersonName } from '../App/utils';
import { useForm } from '../UseForm/UseForm';

interface PersonFormProps {
    node: Readonly<Node>;
}

export const PersonForm = memo(
  function PersonForm({ node }: PersonFormProps) {
    // defining the initial state for the form
    const initialState = {
        firstName: node.infoNode?.firstName,
        lastName: node.infoNode?.lastName,
    };
    console.log(node)

    // getting the event handlers from our custom hook
    const { onChange, onSubmit, values } = useForm(
        loginUserCallback,
        initialState
    );

    // a submit function that will execute upon form submission
    async function loginUserCallback() {
      console.log(values)
      console.log(node)
        // send "values" to database
    }

    return (
        // don't mind this ugly form :P
        <form onSubmit={onSubmit}>
        <div>
            <input
                name='firstName'
                id='firstName'
                type='text'
                placeholder='firstName'
                defaultValue={initialState.firstName}
                onChange={onChange}
                required
                />

            <input
                name='lastName'
                id='lastName'
                type='text'
                placeholder='lastName'
                defaultValue={initialState.lastName}
                onChange={onChange}
                required
                />
            <button type='submit'>Изменить</button>
        </div>
        </form>
    );
  }
)

// interface PersonFormProps {
//   node: Readonly<Node>;
//   nodeList: ReadonlyArray<Node>;
// }
// interface FormElements extends HTMLFormControlsCollection {
//   name: HTMLInputElement
// }
// interface UsernameFormElement extends HTMLFormElement {
//   readonly elements: FormElements
// }


// type Values = {
//   name: string,
//   email: string,
//   age: string,
// }


// //export const PersonForm = memo(
//   export const PersonForm = ({ nodeList, node }: PersonFormProps) => {
//     var personName = node.infoNode?.firstName ?? ""
//     const [values, setValues] = useState<Values>({
//       name: "",
//       email: "",
//       age: "",
//     });
    
//     const changeHandler = useCallback((event: ChangeEvent<HTMLInputElement>) => {
//       setValues({ ...values, [event.target.name]: event.target.value });
//       console.log("111", event.target.name, event.target.value)
//       event.stopPropagation();
//     }, [nodeList, setValues]);

//     const submitHandler = useCallback((event: FormEvent<UsernameFormElement>) => {
//       console.log(event.currentTarget.elements.name.value);
//       const key = node.infoNode?.firstName;
//       alert('A name was submitted: ' + event.currentTarget.elements.name.value);
//       event.preventDefault();

//     }, [nodeList]);

//     return (
//       <form onSubmit={submitHandler}>
//         <label>
//           Name:
//           <input id="name" type="text" value={values.name} onChange={changeHandler} name={"name"} />
//         </label>
//         <input type="submit" value="Submit" />
//       </form>
//     );
//   }
// //);
