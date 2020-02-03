package puzzles;

import java.util.ArrayList;
import java.util.List;

public class TwoSortedArrayscompare {
public static void main(String[] args) {
	int[] a = new int[] {13, 27, 35, 40, 49, 55, 59};
	int[] b = new int[] {17, 35, 39, 40, 55, 58, 60};
	int j=0,k=0;
	List<Integer> matches = new ArrayList<>();
	int i=0;
	while(j<a.length && k<b.length) {
		i++;
		if(a[j] == b[k]) {
			matches.add(a[j]);
			j++;
			k++;
		}
		if(a[j] > b[k]) {
			 k++ ;
		}else{
			j++;
		}
		System.out.println("count"+ i);
		System.out.println(Integer.toBinaryString(i));
		String l = Integer.toBinaryString(i) ;
		System.out.println(Integer.parseInt(l,2));
	}
	matches.stream().forEach(s -> System.out.println(s));
}
}
