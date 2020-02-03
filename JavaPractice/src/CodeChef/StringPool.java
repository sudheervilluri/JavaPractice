package CodeChef;

import java.util.HashMap;
import java.util.Map;

//Intervview Questionf from FIS
public class StringPool {

	public static void main(String[] args) {
		
		String s1 = "car";
		String s2 = new String("car2");
		String s3 = new String("car2");
		// String copyes
		//System.out.println(s1 = s2);
		System.out.println(s3==s2);
		System.out.println(s2.equals(s3));
		
		//////////////////////(((((***************/
		Map<Integer, Object> list = new HashMap();
		list.put(1, s2);
		list.put(2,new String("test"));
		list.put(1, new String("cool"));
		
		System.out.println(list.get(1));
		
		/**********************************/
		System.out.println("test ambiguity");
		new Ambiguty().print(null);
		new Ambiguty().printvalue(0);
	}
}

class Ambiguty{
	public void print(String s) {
		System.out.println("from String");
	}
	public void print(Object s) {
		System.out.println("from Object");
	}
	
	public void printvalue(Integer i) {
		System.out.println("from integr");
	}
	public void printvalue(long i) {
		System.out.println("from long");
	}
}