import React from 'react'
import { Link } from 'react-router-dom';
import styles from './styles.module.scss'

interface ISectionProps {
    title?: string, 
    linkText?: string, 
    href?: string 
}


const Section:React.FC<ISectionProps> = ({title, linkText, href}) => {
    return (
      <div className={styles.section}>
        <h2>{title}</h2>
        {linkText && 
        <Link to={href || "#"}>
          <p>{linkText}</p>
        </Link>}
      </div>
    );
  };

export default Section