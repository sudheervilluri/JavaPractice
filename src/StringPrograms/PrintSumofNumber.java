package StringPrograms;

import java.util.HashMap;
import java.util.Map;

public class PrintSumofNumber {

	
	
	public static void main(String[] args) {
		//sumofdigits();
		//sumofNumbers();
		//wordOccurence();
		stringReverse();
	}
	//This Program is to print sum of numbers in given string
	private static void sumofdigits() {
		String s = "12abch45hfgl"; //1+2+4+5
		int sum =0;
		for (int i = 0; i < s.length(); i++) {
			if(Character.isDigit(s.charAt(i))) {
				String temp = ""+s.charAt(i);
				sum+=Integer.parseInt(temp);
			}
		}
		System.out.println(sum);
	}
	
	//PrintSumofNumbers
	private static void sumofNumbers() {
		String s = "12abch45hfgl"; //12+45
		int count =0;
		int sum = 0;
		for (int i = 0; i < s.length(); i++) {
			if(Character.isDigit(s.charAt(i))) {
				count++;
			}else{
				if(count!=0) {
				String temp = ""+s.substring((i-count), i);
				sum+=Integer.parseInt(temp);
				}
				count =0;
			}
		}
		System.out.println(sum);
	}
	
	//Print words and occurennce in file 
	public static void wordOccurence() {
		String s = "This is a bad Practice , is IT bad ?";
		String[] st = s.split(" ");
		Map<String, Integer> ls = new HashMap<>();
		for (String string : st) {
			if(ls.containsKey(string)) {
				Integer count = ls.get(string);
				//count++;
				ls.put(string, ++count);
			}else {
				ls.put(string, 1);
			}
		}
		System.out.println(ls);
	}
	
	//String Reverse using Recursive
	public static void stringReverse() {
		String s ="Test this";
		
		System.out.println(reverseRecursive(s));
	}
	
	static String reverseRecursive(String s){
		if(s.length()==0 || s.length()==0 ) {
			return s;
		}else {
			return reverseRecursive(s.substring(1))+s.charAt(0);
		}
		
	}
	
}
