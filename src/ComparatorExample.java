import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class ComparatorExample {

@SuppressWarnings("unchecked")
public static void main(String[] args) {
	List<Country> countrylist = new ArrayList();
	countrylist.add(new Country("ab", 12));
	countrylist.add(new Country("Pakistan", 13));
	countrylist.add(new Country("India", 13));
	
	Comparator comperatorTest = new Comparator<Country>() {
		@Override
		public int compare(Country o1, Country o2) {
		return o1.getName().compareTo(o2.getName());
		}
	};
	Collections.sort(countrylist,comperatorTest);
	
	for (Country country : countrylist) {
		System.out.println(country.getName()+" "+country.getPopulation());
	}
}

	
}
