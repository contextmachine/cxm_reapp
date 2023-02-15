import { gql } from "@apollo/client";

export const QUERY = gql`
  query Query($id: uuid!) {
    projects_queries_hub_by_pk(id: $id) {
      body
      endpoint
      id
      name
      project_name
      tags
    }
  }
`;

export const ADD_QUERY = gql`
  mutation addQuery($object: projects_queries_hub_insert_input!) {
    insert_projects_queries_hub_one(object: $object) {
      id
    }
  }
`;

export const EDIT_QUERY = gql`
  mutation editQuery($id: uuid!, $object: projects_queries_hub_set_input!) {
    update_projects_queries_hub_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
    }
  }
`;

export const DELETE_QUERY = gql`
  mutation deleteQuery($id: uuid!) {
    delete_projects_queries_hub_by_pk(id: $id) {
      id
    }
  }
`;

export const QUERIES = gql`
  query getQueries($project_name: String!) {
    projects_queries_hub(
      where: { project_name: { _eq: $project_name } }
      order_by: { cr: desc_nulls_last }
    ) {
      tags
      project_name
      name
      endpoint
      body
      id
    }
  }
`;
