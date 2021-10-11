import React, { Component } from "react";
import dai from "../dai.png";

export default class Main extends Component {
  render() {
    const {
      daiTokenBalance,
      dappTokenBalance,
      stakingBalance,
      stakeTokens,
      unstakeTokens,
    } = this.props;
    return (
      <div id="content" className="mt-3">
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Staking Balance</th>
              <th scope="col">Reward Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{window.web3.utils.fromWei(stakingBalance, "Ether")} mDAI</td>
              <td>
                {window.web3.utils.fromWei(dappTokenBalance, "Ether")} DAPP
              </td>
            </tr>
          </tbody>
        </table>
        <div className="card mb-4">
          <div className="card-body">
            <form
              className="mb-3"
              onSubmit={(e) => {
                e.preventDefault();
                let amount;
                amount = this.input.value.toString();
                amount = window.web3.utils.toWei(amount, "Ether");
                stakeTokens(amount);
              }}
            >
              <div>
                <label className="float-left">
                  <b>Stake Tokens</b>
                </label>
                <span className="float-right text-muted">
                  Balance: {window.web3.utils.fromWei(daiTokenBalance, "Ether")}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="0"
                  required
                  ref={(input) => {
                    this.input = input;
                  }}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={dai} height="32" alt="" />
                    &nbsp;&nbsp;&nbsp; mDAI
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
              >
                STAKE!
              </button>
            </form>
            <button type="submit" className="btn btn-link btn-block btn-sm" onClick={e=>{
                e.preventDefault();
                unstakeTokens()
            }} >
                UN STAKE...
            </button>
          </div>
        </div>
      </div>
    );
  }
}
