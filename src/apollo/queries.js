import gql from "graphql-tag";

export const GET_BOARDS = gql`
  query {
    boards {
      id
      name
      groups {
        id
        title
      }
    }
  }
`;

export const CREATE_ITEM = gql`
  mutation ($board_id: Int!, $group_id: String!, $item_name: String!) {
    create_item (board_id: $board_id, group_id: $group_id, item_name: $item_name) {
      id
    }
  }
`;

export const CREATE_UPDATE = gql`
  mutation ($item_id: Int!, $body: String!) {
    create_update (item_id: $item_id, body: $body) {
      id
    }
  }
`;

export const ADD_FILE = gql`
  mutation ($update_id: Int!, $file: File!) {
    add_file_to_update (update_id: $update_id, file: $file) {
      id
    }
  }
`;
