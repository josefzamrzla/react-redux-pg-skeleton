import _ from 'lodash';

export const normalizeById = entities => ({
  ids: entities.map(entity => entity.id),
  entities: _.keyBy(entities, 'id')
});

export const deleteEntityById = (state, entityId) => {
  const { [entityId]: deleted, ...rest } = state.entities;
  return {
    entities: rest,
    ids: state.ids.filter(id => id !== entityId)
  };
};

export const upsertEntity = (state, entity, isNewEntity, mergeProps = () => ({})) => {
  // prevent duplications
  if (isNewEntity && state.ids.includes(entity.id)) {
    return state;
  }

  // updated entity is not in store
  if (!(isNewEntity || state.ids.includes(entity.id))) {
    return state;
  }

  return {
    entities: {
      ...state.entities,
      [entity.id]: {
        ...entity,
        ...mergeProps()
      }
    },
    ids: isNewEntity ? [entity.id, ...state.ids] : state.ids
  };
};

export default normalizeById;
