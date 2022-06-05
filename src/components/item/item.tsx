import { component$, useStore, Host, useRef, useWatch$, useContext } from '@builder.io/qwik';

import { TodoItem, TODOS } from '../../state/state';

/**
 * Individual items of the component.
 *
 * It only rerenders if the user infarcts with it or if the item itself changes.
 */

export interface ItemProps {
  item: TodoItem;
}

export const Item = component$(
  (props: ItemProps) => {
    const state = useStore({ editing: false });
    const editInput = useRef<HTMLInputElement>();
    const todos = useContext(TODOS);

    useWatch$((track) => {
      const current = track(editInput, 'current');
      if (current) {
        current.focus();
        current.selectionStart = current.selectionEnd = current.value.length;
      }
    });

    return (
      <Host class={{ completed: props.item.completed, editing: state.editing }}>
        <div class="view">
          <input
            class="toggle"
            type="checkbox"
            checked={props.item.completed}
            onClick$={() => {
              props.item.completed = !props.item.completed;
            }}
          />
          <label
            onDblclick$={async () => {
              state.editing = true;
            }}
          >
            {props.item.title}
          </label>
          <button
            class="destroy"
            onClick$={() => {
              const todoItem = props.item;
              todos.items = todos.items.filter((i) => i != todoItem);
            }}
          />
        </div>
        {state.editing ? (
          <input
            class="edit"
            ref={editInput}
            value={props.item.title}
            onBlur$={() => (state.editing = false)}
            onKeyup$={(event: any) => {
              const inputValue = (event.target as HTMLInputElement).value;
              props.item.title = inputValue;
              if (event.key === 'Enter') {
                state.editing = false;
              }
            }}
          />
        ) : null}
      </Host>
    );
  },
  {
    tagName: 'li',
  }
);
