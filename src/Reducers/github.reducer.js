import gql from "graphql-tag";
import { client } from '../Config/apollo.client';

export default function githubReducer(
    state = {
        repositories: [],
        userInfo: {},
        searchText: '',
        error: null
    }, action) {

    switch (action.type) {
        case "SEARCH_REPOSITORIES_FINISHED": {
            return { ...state, repositories: action.payload, userInfo: action.userInfo, searchText: action.searchText }
        }
        case "SEARCH_REPOSITORIES_ERROR": {
            return { ...state, error: action.payload }
        }
        case "CLEAR_SEARCH": {
            return { ...state, repositories: [] }
        }
        default: {
            return state
        }
    }
}

function getUserInfo(data, repoId) {
    const repositories = (data.repositoryOwner && data.repositoryOwner.repositories.edges) || [];

    const repo = repositories.filter(function (repository) {
        return repository.node.id === repoId;
    });

    return (repo && repo.length && repo[0].node) || {};
}

export function clearSearch() {
    return {
        type: "CLEAR_SEARCH"
    }
}

export function searchProject(searchValue, repoId) {
    const searchQuery = gql`{
        repositoryOwner(login:${searchValue}) {
            repositories(first: 10){
                edges {
                    node {
                        createdAt,
                        description,
                        name,
                        url,
                        id,
                        owner {
                            login,
                            avatarUrl,
                            url
                        }
                    }
                }
            }
        }
      }`;


    return function (dispatch) {
        return client.query({ query: searchQuery }).then(
            ({ data }) => dispatch({
                type: "SEARCH_REPOSITORIES_FINISHED",
                payload: (data.repositoryOwner && data.repositoryOwner.repositories.edges) || {},
                userInfo: getUserInfo(data, repoId),
                searchText : searchValue
            }),
            (error) => {
                dispatch({ type: "SEARCH_REPOSITORIES_ERROR", payload: error })
            }
        );
    }
}