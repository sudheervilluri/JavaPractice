package CodeChef;

import java.util.Arrays;

public class FindOutlier {
	static int find(int[] integers) {
		int sum = Arrays.stream(integers).limit(3)
				.map(i -> Math.abs(i) % 2).sum();
		int mod = (sum == 0 || sum == 1) ? 1 : 0;

        return Arrays.stream(integers).parallel() // call parallel to get as much bang for the buck on a "large" array
                .filter(n -> Math.abs(n) % 2 == mod).findFirst().getAsInt();
		
	}
}
