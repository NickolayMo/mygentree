import { memo, useCallback } from 'react';
import type { InfoNode, Node } from '../../renderTree/types';
import { useForm } from '../UseForm/UseForm';
import classNames from 'classnames';
import css from './PersonForm.module.css';
import { createPerson, updatePerson } from './actions';
import Select from 'react-select'

interface PersonFormProps {
  createForm?: boolean
  className?: string;
  node: Readonly<Node>;
  nodeList: ReadonlyArray<Node>;
  onPersonChange: (nodes: readonly Readonly<Node>[]) => void;
  onClose: (isVisible: boolean) => void;
}

export const PersonForm = memo(
  function PersonForm({ createForm, className, node, nodeList, onPersonChange, ...props }: PersonFormProps) {
    const closeHandler = useCallback(() => props.onClose(false), [props]);
    const initialState = !createForm ? {
      firstName: node.infoNode?.firstName,
      middleName: node.infoNode?.middleName,
      lastName: node.infoNode?.lastName,
      avatar: node.infoNode?.avatar,
      birthDate: node.infoNode?.birthDate,
      location: node.infoNode?.location,
      occupation: node.infoNode?.occupation
    }: {};
    const { onChange, onSubmit, onSelect, values } = useForm(
      createForm ? createUserCallback : updateUserCallback,
      initialState
    );

    async function updateUserCallback() {
      updatePerson(values, node, onPersonChange)
    }

    async function createUserCallback() {
      createPerson(values, node, onPersonChange)
    }
    const options = [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' }
    ]

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
            <div>
              <label>родители</label>
              <select id='parents' name='parent' multiple onChange={onSelect}>
                {nodeList.map((nodeVal) => {
                  var selected = node.parents.find((p)=>p.id === nodeVal.id)
                  if (selected && !createForm) {
                    return (<option id={nodeVal.id} selected>
                      ({nodeVal.id}) {nodeVal.infoNode?.firstName}
                    </option>)
                  }
                  return (<option id={nodeVal.id}>
                    ({nodeVal.id}) {nodeVal.infoNode?.firstName}
                  </option>)
                })}
              </select>
            </div>
            <button type='submit'>Изменить</button>
          </div>
          <div>
            <Select options={options}/>
          </div>
        </form>
        <button className={css.close} onClick={closeHandler}>&#10005;</button>
      </div>
    );
  }
)