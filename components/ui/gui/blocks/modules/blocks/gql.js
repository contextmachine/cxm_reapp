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

export const INFOGRAPHICS_PK = gql`
  query getInfographics_pk($id: uuid!) {
    projects_infographics_hub_by_pk(id: $id) {
      body
      project_name
      object_id
      name
      id
      cr
    }
  }
`;

export const INFOGRAPHICS = gql`
  query getInfographics($object_id: Int!, $project_name: String!) {
    projects_infographics_hub(
      where: {
        object_id: { _eq: $object_id }
        project_name: { _eq: $project_name }
      }
    ) {
      project_name
      object_id
      name
      body
      cr
      id
    }
  }
`;

export const ADD_INFOGRAPHICS = gql`
  mutation addInfographics($object: projects_infographics_hub_insert_input!) {
    insert_projects_infographics_hub_one(object: $object) {
      id
    }
  }
`;

export const EDIT_INFOGRAPHICS = gql`
  mutation editInfographics(
    $id: uuid!
    $object: projects_infographics_hub_set_input!
  ) {
    update_projects_infographics_hub_by_pk(
      pk_columns: { id: $id }
      _set: $object
    ) {
      id
    }
  }
`;

export const DELETE_INFOGRAPHICS = gql`
  mutation deleteInfographics($id: uuid!) {
    delete_projects_infographics_hub_by_pk(id: $id) {
      id
    }
  }
`;
