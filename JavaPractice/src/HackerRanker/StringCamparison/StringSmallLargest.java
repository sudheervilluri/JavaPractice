package HackerRanker.StringCamparison;

import java.util.Scanner;

public class StringSmallLargest {

    public static String getSmallestAndLargest(String s, int k) {
        String smallest = "";
        String largest = "";

     String[] str = new String[s.length()-k+1];
    for(int i=0;i<=s.length()-k;i++){
        str[i] = s.substring(i,i+k);
    }
    java.util.Arrays.sort(str);
        // Complete the function
        // 'smallest' must be the lexicographically smallest substring of length 'k'
        // 'largest' must be the lexicographically largest substring of length 'k'
        
        return str[0] + "\n" + str[1];
    }


    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        String s = scan.next();
        int k = scan.nextInt();
        scan.close();
      
        System.out.println(getSmallestAndLargest(s, k));
    }
}

/**
 * welcometojava
3
 */
