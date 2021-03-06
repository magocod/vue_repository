/**
 *
 */

import { JSONtestserver, dbclient, firebaseexport } from '../../services';
import { CollectionF } from '../interfaces';

import {
  ADD_ARRAY,
} from '../mutation-types';

import { ActionContext, Module } from 'vuex';

export interface CollectionStore {
  collections: CollectionF[];
}

const state: CollectionStore = {
  collections: [],
};

const getters = {

  QUANTITY_RECORDS: (state: CollectionStore) => {
    return state.collections.length;
  },

};

const mutations = {

  [ADD_ARRAY]: (state: CollectionStore, payload: CollectionF[]) => {
    state.collections = payload;
  },

};

const actions = {

  /**
   * [BY_CATEGORY description]
   */
  async BY_CATEGORY({ state, commit }: ActionContext<CollectionStore, any>, payload: string) {
    try {
      const snapshot = await dbclient.collection('collections').where(
        `categories.${payload}`, '==', true,
      ).get();
      if (snapshot.metadata.fromCache === true) {
        return Promise.reject('opteniendo del cache SDK, sin conexion a internet');
      } else {
        const array: CollectionF[] = [];
        snapshot.forEach((doc) => {
          const ob: any = firebaseexport(doc.data(), doc.id);
          array.push(ob);
        });
        // actualizar estado de la app
        commit('ADD_ARRAY', array);
        return 'conexion exitosa';
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },

  /**
   * [BY_CATEGORY description]
   */
  async BY_THEME({ state, commit }: ActionContext<CollectionStore, any>, payload: string) {
    try {
      const snapshot = await dbclient.collection('collections').where(
        'theme', '==', payload,
      ).get();
      if (snapshot.metadata.fromCache === true) {
        return Promise.reject('opteniendo del cache SDK, sin conexion a internet');
      } else {
        const array: CollectionF[] = [];
        snapshot.forEach((doc) => {
          const ob: any = firebaseexport(doc.data(), doc.id);
          array.push(ob);
        });
        // actualizar estado de la app
        commit('ADD_ARRAY', array);
        return 'conexion exitosa';
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async SEARCH_BY_THEME({ state, commit }: ActionContext<CollectionStore, any>, payload: number) {
    try {
      const response = await JSONtestserver.get(
        `http://localhost:3000/collections?theme=${payload}`,
      );
      commit('ADD_ARRAY', response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

};

export const collection: Module<CollectionStore, any> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
