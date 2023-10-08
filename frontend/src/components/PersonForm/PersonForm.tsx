import { memo, useCallback } from 'react';
import { Gender, type InfoNode, type Node } from '../../renderTree/types';
import { useForm } from '../UseForm/UseForm';
import classNames from 'classnames';
import css from './PersonForm.module.css';
import { addChild, addParent, addSpouse, updatePerson } from './actions';

export const enum FormTypes {
  "ADD_CHILD",
  "ADD_PARENT",
  "ADD_SPOUSE",
  "EDIT"
}

interface PersonFormProps {
  formType?: FormTypes
  className?: string;
  node: Readonly<Node>;
  nodeList: ReadonlyArray<Node>;
  onPersonChange: (nodes: readonly Readonly<Node>[]) => void;
  onClose: (isVisible: boolean) => void;
}

export const PersonForm = memo(
  function PersonForm({ formType, className, node, nodeList, onPersonChange, ...props }: PersonFormProps) {
    const closeHandler = useCallback(() => props.onClose(false), [props]);
    const initialState = formType === FormTypes.EDIT ? {
      firstName: node.infoNode?.firstName,
      middleName: node.infoNode?.middleName,
      lastName: node.infoNode?.lastName,
      avatar: node.infoNode?.avatar,
      birthDate: node.infoNode?.birthDate,
      location: node.infoNode?.location,
      occupation: node.infoNode?.occupation,
      gender: node.gender
    } : {};

    const formCallback = () => {
      switch (formType) {
        case FormTypes.ADD_CHILD:
          return addChildCallback
        case FormTypes.ADD_PARENT:
          return addParentCallback
        case FormTypes.ADD_SPOUSE:
          return addSpouseCallback
        default:
          return updateUserCallback
      }
    }
    const { onChange, onSubmit, onSelect, values } = useForm(
      formCallback(),
      initialState
    );

    async function updateUserCallback() {
      updatePerson(values, node, onPersonChange)
    }

    async function addChildCallback() {
      addChild(values, node, onPersonChange)
    }
    async function addParentCallback() {
      addParent(values, node, onPersonChange)
    }
    async function addSpouseCallback() {
      addSpouse(values, node, onPersonChange)
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
              <label>Пол</label>
              <select value={initialState.gender} id='gender' name='gender' onChange={onSelect}>
                <option id={Gender.male} value={Gender.male}>
                  Мужской
                </option>
                <option id={Gender.female} value={Gender.female}>
                  Женский
                </option>
              </select>
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