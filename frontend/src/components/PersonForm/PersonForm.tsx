import { memo, useCallback } from 'react';
import type { InfoNode, Node } from '../../renderTree/types';
import { useForm } from '../UseForm/UseForm';
import classNames from 'classnames';
import css from './PersonForm.module.css';

interface PersonFormProps {
  className?: string;
  node: Readonly<Node>;
  onPersonChange: (nodes: readonly Readonly<Node>[]) => void;
  onClose: (isVisible: boolean) => void;
}

export const PersonForm = memo(
  function PersonForm({ className, node, onPersonChange, ...props}: PersonFormProps) {
    const closeHandler = useCallback(() => props.onClose(false), [props]);
    const initialState = {
      firstName: node.infoNode?.firstName,
      middleName: node.infoNode?.middleName,
      lastName: node.infoNode?.lastName,
      avatar: node.infoNode?.avatar,
      birthDate: node.infoNode?.birthDate,
      location: node.infoNode?.location,
      occupation: node.infoNode?.occupation
    };
    const { onChange, onSubmit, values } = useForm(
      updateUserCallback,
      initialState
    );
    async function updateUserCallback() {
      const formVals = values as InfoNode
      fetch(
        process.env.REACT_APP_TREE_APP_SERVICE_URL + "/web/api/v1/tree/update/person",
        {
          method: "POST",
          body: JSON.stringify({
            "userId": "HkqEDLvxE",
            "treeId": "1",
            "action": "UPDATE",
            "nodeId": node.id,
            "context": {
              "avatar": formVals.avatar,
              "firstName": formVals.firstName,
              "middleName": formVals.middleName,
              "lastName": formVals.lastName,
              "birthDate": formVals.birthDate,
              "occupation": formVals.occupation,
              "location": formVals.location
            }
          }),
          headers: {
            "Content-Type": "application/json",
          }
        }
      ).then((res) => res.json())
        .then((res) => res.data)
        .then((res) => onPersonChange(res.relatives))
    }

    return (
      <div className={classNames(css.root, className)}>
        <form onSubmit={onSubmit}>
          <div>
            <div>
              <label>фото</label><input
                name='avatar'
                id='avatar'
                type='text'
                placeholder='avatarUrl'
                defaultValue={initialState.avatar}
                onChange={onChange}
              />
            </div>
            <div>
              <label>Имя</label>
              <input
                name='firstName'
                id='firstName'
                type='text'
                placeholder='firstName'
                defaultValue={initialState.firstName}
                onChange={onChange}
              />
            </div>
            <div>
              <label>Отчество</label>
              <input
                name='middleName'
                id='middleName'
                type='text'
                placeholder='middleName'
                defaultValue={initialState.middleName}
                onChange={onChange}
              />
            </div>
            <div>

              <label>Фамилия</label>
              <input
                name='lastName'
                id='lastName'
                type='text'
                placeholder='lastName'
                defaultValue={initialState.lastName}
                onChange={onChange}
              />
            </div>
            <div>
              <label>Дата рождения</label>
              <input
                name='birthDate'
                id='birthDate'
                type='text'
                placeholder='birthDate'
                defaultValue={initialState.birthDate}
                onChange={onChange}
              />
            </div>
            <div>
              <label>Место жительства</label>
              <input
                name='location'
                id='location'
                type='text'
                placeholder='location'
                defaultValue={initialState.location}
                onChange={onChange}
              />
            </div>
            <div>
              <label>Род занятий</label>
              <input
                name='occupation'
                id='occupation'
                type='text'
                placeholder='occupation'
                defaultValue={initialState.occupation}
                onChange={onChange}
              />
            </div>
            <button type='submit'>Изменить</button>
          </div>
        </form>
        <button className={css.close} onClick={closeHandler}>&#10005;</button>
      </div>
    );
  }
)