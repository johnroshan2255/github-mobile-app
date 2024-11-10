import { SelectList } from 'react-native-dropdown-select-list';
import { StyleSheet } from 'react-native';

const RepoSelect = ({ handleRepoChange, dropdownData, selectedRepo }) => {
    return(
        <SelectList 
            setSelected={handleRepoChange}
            data={dropdownData} 
            save="value" 
            defaultOption={{ key: selectedRepo, value: selectedRepo }}
            boxStyles={styles.dropdown} 
            placeholder="Select Repository" 
        />
    );
}

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        borderWidth: 2,
        borderColor: 'rgb(169 170 239)',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
});

export default RepoSelect