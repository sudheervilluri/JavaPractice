package CodeChef;

public class Agre {

	 public static int nbYear(int p0, double percent, int aug, int p) {
	        // your code
	        int sum=p0;int years=0;
	        while(sum<p){
	        sum= (int)(sum*percent/100) +sum+aug;
	        years++;
	        }
	        return years;
	    }
}
