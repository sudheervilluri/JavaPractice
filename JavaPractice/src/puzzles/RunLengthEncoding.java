package puzzles;

public class RunLengthEncoding {
	public static void main(String[] args) {
		String str = "wwwwaaadexxxxxxywww";
		printRLE(str);
	}

	private static void printRLE(String str) {
		int n = str.length();
		for (int i = 0; i < n; i++) {

			// Count occurrences of current character
			int count = 1;
			while (i < n - 1 && str.charAt(i) == str.charAt(i + 1)) {
				count++;
				i++;
			}

			if(count==1) {
				System.out.print(str.charAt(i));
			}else {
				System.out.print(count);
			}
			// Print character and its count
		
			
		}
	}
}
