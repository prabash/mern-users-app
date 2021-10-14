import React, { Component } from "react";
import { useTable, useSortBy, useGlobalFilter, useAsyncDebounce } from 'react-table'
import { Link, useHistory, Redirect } from 'react-router-dom';
import moment from "moment"
import Background from "../../images/bg.png"
import styled from 'styled-components'
import api from "../../api/index"
import "./dashboard.css";
import { Button } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert'

/* Components */

var sectionStyle = {
  backgroundImage: `url(${Background})`
};

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  )

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows.slice(0, 20)

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map(
            (row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )
            }
          )}
        </tbody>
      </table>
    </>
  )
}


export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      columns: [],
      isLoading: false,
      firstName: "User",
      visibleDeactMsg: false,
      visibleInfoMsg: false,
      deactivatedUsers: "",
      noOfDeactUsers: 0,
      activatedUser: "",
    };
  }

  componentDidMount() {
    document.title = "User App : Home";

    console.log("access-token", localStorage.getItem("access-token"));
    var current_user_id = localStorage.getItem("current-user-id");

    api.getUser(current_user_id).then(res => {
      this.setState({ firstName: res.data.data.first_name })
    })

    this.getAllUsers();

    try {
      setInterval(async () => {
        api.getInactiveUsers().then(res => {
          if (res.status == 200) {
            if (res.data.data) {
              var _deactivatedUsers = "";
              var _noOofDeactUsers = 0;

              if (res.data.data.length == 1) {
                _noOofDeactUsers = "user"
                _deactivatedUsers = res.data.data[0].first_name
              }
              else if (res.data.data.length > 1) {
                res.data.data.forEach(user => {
                  _noOofDeactUsers = "users"
                  _deactivatedUsers += user.first_name + ", "
                });
              }

              this.setState({
                noOfDeactUsers: _noOofDeactUsers,
                deactivatedUsers: _deactivatedUsers
              })
            }

            this.setState({ visibleDeactMsg: true }, () => {
              window.setTimeout(() => {
                this.setState({ visibleDeactMsg: false });
              }, 10000);
            });

            this.getAllUsers();
          }
        })
      }, 30000);
    }
    catch (e) {
      console.log(e)
    }
  }


  reactivateUser = (id, first_name) => {
    var data = {
      status: "active",
      id: id
    }
    api.updateUserStatus(data).then(res => {
      if (res.status == 200) {
        this.getAllUsers()
        this.setState({ visibleInfoMsg: true, activatedUser: first_name }, () => {
          window.setTimeout(() => {
            this.setState({ visibleInfoMsg: false });
          }, 3000);
        });
      }
    })
  }

  getAllUsers = (users_arr) => {
    api.getAllUsers().then(res => {
      var users_arr = res.data.data;
      users_arr.forEach(user => {
        if (user.status == "active") {
          user.enable_button = "false"
        }
        else {
          user.enable_button = "true"
        }
        var localDate = moment(user.last_logged_date).local().format('YYYY-MM-DD HH:mm:ss').toString()
        user.last_logged_date = localDate;
      });
      this.setState({ users: users_arr })
    })

  }


  render() {
    const { firstName, users, show, visibleDeactMsg, deactivatedUsers, noOfDeactUsers, activatedUser, visibleInfoMsg } = this.state;
    const columns = [
      {
        Header: 'ID',
        accessor: '_id',
      },
      {
        Header: 'First Name',
        accessor: 'first_name',
        filter: 'fuzzyText',
      },
      {
        Header: 'Last Name',
        accessor: 'last_name',
        filterable: true,
      },
      {
        Header: 'Email',
        accessor: 'email',
        filterable: true,
      },
      {
        Header: 'Type',
        accessor: 'user_type',
        filter: 'includes',
      },
      {
        Header: 'Status',
        accessor: 'status',
        filter: 'includes',
      },
      {
        Header: 'Last Logged Time',
        accessor: 'last_logged_date',
      },
      {
        width: 300,
        Header: "Reactivate User",
        accessor: "name",
        Cell: (props) => {
          return props.row.values.status == "active" ? (
            <button value="deactivate" onClick={() => this.reactivateUser(props.row.values._id, props.row.values.first_name,)} className="btn btn-success" disabled>
              Reactivate
            </button>
          ) : (
            <button value="deactivate" onClick={() => this.reactivateUser(props.row.values._id, props.row.values.first_name)} className="btn btn-primary">
              Reactivate
            </button>
          )
        }
      }
    ]

    let showTable = true;
    if (!users.length) {
      showTable = false;
    }
    return (
      <div className="Home" id="page-wrap" style={{ marginTop: '-20px !important', paddingTop: '20px' }}>
        <div className="container-fluid">
          <div className="row">
            <div style={{ display: "inline-flex" }}>
              <div style={{ height: '100%', width: "100%", justifyContent: "center", display: "flex" }}>
                <h2>Hi, {firstName}!</h2>
              </div>
              <div>
                <button className="logout-btn" onClick={() => logoutUser()}> Logout</button>
              </div>
            </div>
          </div>
          <div className="row">
            <Styles>
              <div style={{ height: '100%', width: "100%", justifyContent: "center", display: "flex" }}>
                <Table columns={columns} data={users} />
              </div>
            </Styles>
          </div>
          <div>
            <Alert show={visibleDeactMsg} variant="danger" onClose={() => this.setState({ visibleDeactMsg: false })} dismissible>
              <Alert.Heading>User Deactivated!</Alert.Heading>
              <p>
                Hey! Just wanted to let you know that {noOfDeactUsers} : <b>{deactivatedUsers}</b> have been deactivated due to being inactive!
              </p>
              <p>
                You can reactivate them by clicking on the <b>Reactivate button</b> in front of their name on the table.
              </p>
            </Alert>
          </div>
          <div>
            <Alert show={visibleInfoMsg} variant="success" onClose={() => this.setState({ visibleInfoMsg: false })} dismissible>
              <Alert.Heading>User Activated!</Alert.Heading>
              <p>
                <b>{activatedUser}</b> has been activated again!!
              </p>
            </Alert>
          </div>
        </div>
      </div>
    );
  }
}

const logoutUser = () => {
  localStorage.setItem("current-user-id", "")
  localStorage.setItem("authorized", 'false')
  localStorage.setItem("user_type", "")
  window.location.reload(false);
}



