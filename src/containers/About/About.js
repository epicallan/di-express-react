import React from 'react';
import styles from './About.scss';
import cx from 'classnames';

export default function About() {
  return (
    <div className={cx('container')}>
      <div className = "row">
        <div className= "col-md-10 col-md-offset-1">
          <header>
            <h1 className= {styles.title}>About the Data Hub</h1>
            <hr></hr>
          </header>
          <section>
            <article>
              <p className = "text-justify">
                The Development Data Hub, launched in early 2015, is the most comprehensive online resource to date for financial flow data alongside poverty, social and vulnerability indicators.
                This resource makes an important contribution to realising the widely shared vision of a world without poverty by helping ensure that the right decisions about resourcing the end of poverty are being made.
              </p>
              <p className = "text-justify">
                It combines an extensive data store with interactive visualisations so that you can chart, map and compare the data you are interested in to get the information you need. You can look at levels of vulnerability of specific countries and populations, gain a better understanding of how poverty is distributed globally, unbundle international flows, and dig deep into domestic resource data to see how it is raised and where it is spent. Where possible, all data is open and can be downloaded for your own use.
              </p>
              <p className = "text-justify">
                All visualisations are developed from officially recognised international data sources, and display the most current data available. The Data Development Hub will continue to grow as we are able to add more data, in-depth information and analysis. It is designed to be intuitive to navigate, enabling complex data to be turned into meaningful information for all to use.
              </p>
            </article>
            <section>
              <header>
                <h3 className= {styles.title}>Get the data on:</h3>
              </header>
              <article>
                <h3>Poverty – the global picture</h3>
                <ul>
                  <li>Global poverty levels</li>
                  <li>Vulnerability levels</li>
                  <li>Population censuses and vital statistics</li>
                </ul>
              </article>
              <article>
                <h3>Resources – the global picture:</h3>
                <ul>
                  <li>Domestic spending and revenue</li>
                  <li>International official finance (including ODA)</li>
                  <li>International resource flows </li>
                  <li>Humanitarian assistance</li>
                </ul>
              </article>
              <article>
                <h3>Aid/ODA and other official finance:</h3>
                <ul>
                  <li>Unbundle aid flows across every donor and recipient</li>
                  <li>Unbundle other official finance </li>
                </ul>
              </article>
              <article>
                <h3>The national and sub-national picture:</h3>
                <ul>
                  <li>Country Profiles</li>
                  <li>Spotlights</li>
                </ul>
              </article>
            </section>
          </section>
        </div>
      </div>
    </div>
  );
}
