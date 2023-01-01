import {IonSearchbar} from '@ionic/react';
import styles from './styles.module.scss';
type ISearchBarProps = {
  searchValue?: string;
  searchPlaceholder?: string;
  showClearButton?: 'never' | 'focus' | 'always';
  onChange?: (value: any) => void;
};

const SearchBar: React.FC<ISearchBarProps> = ({
  searchValue,
  searchPlaceholder,
  showClearButton = 'always',
  onChange,
}) => {
  return (
    <IonSearchbar
      className={styles.searchBar + ' ion-no-padding'}
      value={searchValue}
      mode="ios"
      placeholder={searchPlaceholder}
      showClearButton={showClearButton}
      onIonChange={(e) => {
        onChange && onChange(e);
      }}
    ></IonSearchbar>
  );
};

export default SearchBar;
