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
      gender: node.gender,
      nodeId: node.id
    } : {
      firstName: "",
      middleName: "",
      lastName: "",
      avatar: "",
      birthDate: "",
      location: "",
      occupation: "",
      gender: Gender.male,
      nodeId: ""
    };
    console.log(initialState)
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
      <div className={classNames(css.root, css.container, className)}>
        <button className={css.close} onClick={closeHandler}>&#10005;</button>
        <form onSubmit={onSubmit}>
          <div>
            <div className={css.row}>
              <div className={css.col_25}>
                <label>фото</label>
              </div>
              <div className={css.col_75}>
                <input
                  name='avatar'
                  id='avatar'
                  type='text'
                  placeholder='фото'
                  defaultValue={initialState.avatar}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className={css.row}>
              <div className={css.col_25}>
                <label>Пол</label>
              </div>
              <div className={css.col_75}>
                <select value={initialState.gender} id='gender' name='gender' onChange={onSelect}>
                  <option id={Gender.male} value={Gender.male}>
                    Мужской
                  </option>
                  <option id={Gender.female} value={Gender.female}>
                    Женский
                  </option>
                </select>
              </div>
            </div>
            <div className={css.row}>
              <div className={css.col_25}>
                <label>Имя</label>
              </div>
              <div className={css.col_75}>
                <input
                  name='firstName'
                  id='firstName'
                  type='text'
                  placeholder='Имя'
                  defaultValue={initialState.firstName}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className={css.row}>
              <div className={css.col_25}>
                <label>Отчество</label>
              </div>
              <div className={css.col_75}>
                <input
                  name='middleName'
                  id='middleName'
                  type='text'
                  placeholder='Отчество'
                  defaultValue={initialState.middleName}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className={css.row}>
              <div className={css.col_25}>
                <label>Фамилия</label>
              </div>
              <div className={css.col_75}>
                <input
                  name='lastName'
                  id='lastName'
                  type='text'
                  placeholder='Фамилия'
                  defaultValue={initialState.lastName}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className={css.row}>
              <div className={css.col_25}>
                <label>Дата рождения</label>
              </div>
              <div className={css.col_75}>
                <input
                  name='birthDate'
                  id='birthDate'
                  type='date'
                  placeholder='Дата рождения'
                  defaultValue={initialState.birthDate}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className={css.row}>
              <div className={css.col_25}>
                <label>Место жительства</label>
              </div>
              <div className={css.col_75}>
                <input
                  name='location'
                  id='location'
                  type='text'
                  placeholder='Место жительства'
                  defaultValue={initialState.location}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className={css.row}>
              <div className={css.col_25}>
                <label>Род занятий</label>
              </div>
              <div className={css.col_75}>
                <input
                  name='occupation'
                  id='occupation'
                  type='text'
                  placeholder='Род занятий'
                  defaultValue={initialState.occupation}
                  onChange={onChange}
                />
              </div>
            </div>
            <br/>
            <div className={css.row}>
              <input type='submit' value="Сохранить" />
            </div>
          </div>
          <input type='hidden' name='nodeId' id='nodeId' value={initialState.nodeId} onChange={onChange} />
        </form>

      </div>
    );
  }
)