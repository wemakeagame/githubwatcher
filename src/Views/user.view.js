import React, { Component } from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import "./user.view.scss"
import { searchProject } from "../Reducers/github.reducer"

export class UserView extends Component {
    componentWillMount() {
        const params = this.props.match.params;

        this.props.dispatch(searchProject(this.props.searchText || params.id, params.repoid));
    }

    render() {

        if(!this.props.token) {
            return <div className="container user-detail">
                <p>You need set the authentication token...</p>
                <Link to="/" className="btn btn-primary">Back</Link>
            </div>
        }

        if (this.props.userInfo.owner) {
            const info = this.props.userInfo;

            return <div className="container user-detail">
                <div className="user">
                    <p><img src={info.owner.avatarUrl} alt={info.owner.avatarUrl} /></p>
                    <p className="user-name">@{info.owner.login}</p>
                    <p><a href={info.owner.url} target="_blank" rel="">See github page</a></p>
                    <Link to="/" className="btn btn-danger">Close</Link>
                </div>
            </div>;
        }

        return <div className="loading-msg">loading...</div>
    }
}

const mapStoreToProps = function (store) {
    return {
        userInfo: store.userInfo,
        repositories: store.repositories,
        searchText: store.searchText,
        token: store.token
    };
}

export default connect(mapStoreToProps)(UserView);