import { useState } from 'react';

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const StatisticLine = ({ text, value }) => (
  <div>
    <table>
      <tbody>
        <tr>
          <td>{text}</td>
          <td>{value}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const Statistics = ({ stats }) => {
  if (stats.good == 0 && stats.neutral === 0 && stats.bad === 0)
    return <div>No feedback given</div>;
  return (
    <div>
      <StatisticLine text="good" value={stats.good} />
      <StatisticLine text="neutral" value={stats.neutral} />
      <StatisticLine text="bad" value={stats.bad} />
      <StatisticLine text="all" value={stats.all} />
      <StatisticLine text="average" value={stats.average} />
      <StatisticLine text="positive" value={stats.positive} />
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => setGood(good + 1);
  const handleBadClick = () => setBad(bad + 1);
  const handleNeutralClick = () => setNeutral(neutral + 1);

  const all = good + neutral + bad;
  const average = (good - bad) / all;
  let positive = (good / all) * 100;
  positive = positive.toString() + ' %';

  const stats = {
    good: good,
    neutral: neutral,
    bad: bad,
    average: average,
    all: all,
    positive: positive,
  };

  return (
    <div>
      <h1>give feedback</h1>

      <div>
        <Button text="good" handleClick={handleGoodClick} />
        <Button text="netural" handleClick={handleNeutralClick} />
        <Button text="bad" handleClick={handleBadClick} />
      </div>

      <h1>statistics</h1>

      <Statistics stats={stats} />
    </div>
  );
};

export default App;
