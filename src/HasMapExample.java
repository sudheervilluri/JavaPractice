import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.Map.Entry;

public class HasMapExample {

	
	
	public static void main(String[] args) {
//	int arr[] = {1,2,3,4,5,6,1,2,3,2,3,3};
//		Map<Integer,Integer> str = new HashMap<>();
//		for (int i = 0; i < arr.length; i++) {
//			
//			if(str.containsKey(arr[i])) {
//				int count = str.get(arr[i]).intValue();
//				str.put(arr[i], ++count);
//			}else {
//				str.put(arr[i], 1);
//			}
//			
//		}
//		 for (Map.Entry m:str.entrySet()) {
//			System.out.println(m.getKey() + "value" + m.getValue());
//		}
//	
//	
	
	Map<Country, Integer> countrylist = new HashMap<>();
	countrylist.put(new Country("ab", 12), 1);
	countrylist.put(new Country("Pakistan", 13), 2);
	countrylist.put(new Country("India", 13), 2);
for (Iterator iterator = countrylist.entrySet().iterator(); iterator.hasNext();) {
	Map.Entry type =  (Map.Entry) iterator.next();
	
	System.out.println(type.getValue() + " " +(Country)type.getKey());
	
}

	Map<String,Integer> intlist = new HashMap<>();
	intlist.put("1", 2);
	intlist.put("2", 2);
	for (Iterator iterator = intlist.entrySet().iterator(); iterator.hasNext();) {
		Map.Entry type =  (Map.Entry) iterator.next();
		System.out.println(type.hashCode());
	}
	
	System.out.println(Objects.hashCode(1)  ^ Objects.hashCode(2));
	


}
	
}
