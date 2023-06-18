import { memo } from 'react';
import type { Node } from '../../renderTree/types';
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