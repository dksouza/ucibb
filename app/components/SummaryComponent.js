import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
// import StringUtil from 'mov-react-native/components/stringutil';

import { BBText, BBIcon, BBTouchable } from 'mov-react-native-ui';

import Piechart from './PieChart';
import LineChart from './LineChart';

const month = {
  1: 'JAN',
  2: 'FEV',
  3: 'MAR',
  4: 'ABR',
  5: 'MAI',
  6: 'JUN',
  7: 'JUL',
  8: 'AGO',
  9: 'SET',
  10: 'OUT',
  11: 'NOV',
  12: 'DEZ',
};

export default class SummaryComponent extends React.Component {
  constructor(props) {
    super(props);
    listaClasse = {};
    this.isNewContribution = this.props.isNewContribution;
    this.state = {
      isLinechart: false,
      periods: [],
    };
  }

  componentWillMount() {
    if (!this.isNewContribution) {
      this.getPeriods();
    }
  }

  componentDidMount() {
    if (!this.props.isNewContribution) {
      this.changeGraph(true);
    }
  }

  changeGraph(isLinechart) {
    this.setState({ isLinechart });
  }

  // Cores a
  getLineChartValues() {
    const linearChartValue = [
      // {
      //   values: [this.props.projection[0].valorTotalAcumuladoAcima, StringUtil.formatStringCurrencyToDecimalNumber(this.props.goal.valorObjetivoRentabilidadeContrato)],
      //   color: '#9B9B9B',
      //   name: 'Minha Meta',
      // },
      {
        values: [this.props.projection[0].valorTotalAcumuladoAcima, this.props.projection[this.props.period].valorTotalAcumuladoAcima],
        color: '#2467a8',
        name: 'Otimista',
      },
      {
        values: [this.props.projection[0].valorTotalAcumuladoBase, this.props.projection[this.props.period].valorTotalAcumuladoBase],
        color: '#31b28a',
        name: 'Esperado',
      },
      {
        values: [this.props.projection[0].valorTotalAcumuladoAbaixo, this.props.projection[this.props.period].valorTotalAcumuladoAbaixo],
        color: '#f5a623',
        name: 'Pessimista',
      },
    ];
    return linearChartValue;
  }

  getMonths(date) {
    return month[Number(String(date).substr(3, 2))];
  }

  getYears(date) {
    return String(date).substr(6, 4);
  }

  getPeriods() {
    const period = [
      { month: this.getMonths(this.props.projection[0].dataReferencia), year: this.getYears(this.props.projection[0].dataReferencia) },
      { month: this.getMonths(this.props.projection[this.props.period].dataReferencia), year: this.getYears(this.props.projection[this.props.period].dataReferencia) },
    ];
    return period;
  }

  renderLineChart() {
    return (
      <LineChart list={this.getLineChartValues()} period={this.getPeriods()} profile={this.props.profile} />
    );
  }


  renderColumnActive(item) {
    return (
      <View style={styles.detailsPercentage}>
        <View>
          <BBText>
            <BBText style={{ fontSize: 25, color: item.color }}>{`${item.percentualAlocacaoClasse}`}</BBText>
            <BBText style={{ fontSize: 20, color: item.color }}>%</BBText>
          </BBText>
          <BBText tinyTitle>{` ${item.nomeClasse}`}</BBText>
        </View>
      </View>
    );
  }

  renderLineActive(line) {
    const columns = [];
    line.forEach(item => {
      columns.push(this.renderColumnActive(item));
    });
    return <View style={{ flexDirection: 'row' }}>{columns}</View>;
  }

  renderPercentActive(listaClasse) {
    const actives = [];
    let line = [];
    listaClasse.forEach((item, index) => {
      line.push(item);
      if ((line.length === 2 || index === listaClasse.length - 1) && index < 6) {
        const bloc = this.renderLineActive(line);
        actives.push(bloc);
        line = [];
      }
    });
    return <View>{actives}</View>;
  }

  renderPieChart = () => {
    const listaClasse = this.props.data.filter((obj, pos, arr) => arr.map(mapObj => mapObj.codigoClasse).indexOf(obj.codigoClasse) === pos);
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.pieContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10 }}>
            <BBText label opacity>
              Perfil
            </BBText>
            <BBText largeTitle opacity>{` ${this.props.profile}`}</BBText>
          </View>
          <Piechart data={listaClasse} />
        </View>
        <View style={styles.pieDetailsContainer}>
          <View style={{ flex: 0.5 }}>{this.renderPercentActive(listaClasse)}</View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View>
        <View style={{ paddingLeft: 10 }}>{!this.state.isLinechart && this.renderPieChart()}</View>
        <View>{this.state.isLinechart && !this.isNewContribution && this.renderLineChart()}</View>
        
      </View>
    );
  }
}

SummaryComponent.propTypes = {
  profile: PropTypes.string.isRequired,
  isNewContribution: PropTypes.bool.isRequired,
  projection: PropTypes.arrayOf(PropTypes.object).isRequired,
  period: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const styles = StyleSheet.create({
  pieContainer: {
    flex: 0.4,
    flexDirection: 'column',
    alignItems: 'center',
  },
  pieDetailsContainer: {
    flex: 0.6,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingTop: 15,
  },
  detailsPercentage: {
    flex: 0.5,
    flexDirection: 'column',
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    width: 1,
    backgroundColor: '#D0D0D0',
  },
});
