package Java8;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class LamdaExpression {
	public static void main(String[] args) {
		List<String> names = Arrays.asList("peter", "anna", "mike", "xenia");
	
		Collections.sort(names, (a,b) -> {
		    return b.compareTo(a);
		});
		
	
	}
}
