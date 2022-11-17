import * as React from 'react';
import { IStocktickerProps } from './IStocktickerProps';
import axios from 'axios';
import { IStockTrackerState } from './IStockTrackerState';

export default class Stockticker extends React.Component<IStocktickerProps, IStockTrackerState> {

  constructor(props: any) {
    super(props);

    this.state = {
      stockTime: "",
      recentClose: "",
      yesterdayClose: "",
      counter: 0
    };
  }

  public render(): React.ReactElement<IStocktickerProps> {

    return (
      <section style={{ backgroundColor: 'blue', color: 'white', fontWeight: 'bold', padding: '15px' }}>
        <h2>Stock Name: {this.props.description}</h2>
        <div>Current Value: {this.state.recentClose}$</div>
        <div>Current Time: {this.state.stockTime}</div>
        <div>Refreshing Stock (every second): {this.state.counter}</div>
      </section>
    );
  }

  private stockAPIcall(): void {
    axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${this.props.stockTicker}&interval=1min&outputsize=compact&apikey=${this.props.apiKey}`)
      .then((res) => {
        console.log(res);
        let data = res.data["Time Series (1min)"];
        let recent = Object.keys(data)[0];
        console.log('updated at ' + new Date());
        return this.setState({
          stockTime: recent.toLocaleString(),
          recentClose: parseFloat(data[recent]["4. close"]).toFixed(2)
        });
      })
      .catch((err) => {
        console.log("err: " + err);
        
      });
  }


  public componentDidMount() {
    this.stockAPIcall();
    console.log("This is first call");


    setInterval(() => {
      this.setState({
        counter: this.state.counter + 1
      });
    }, 3600);
  }
}
