package HackerRanker;

import java.util.*;

public class TestingProgram {

    public static int minimum_index(int[] seq) {
        if (seq.length == 0) {
            throw new IllegalArgumentException("Cannot get the minimum value index from an empty sequence");
        }
        int min_idx = 0;
        for (int i = 1; i < seq.length; ++i) {
            if (seq[i] < seq[min_idx]) {
                min_idx = i;
            }
        }
        return min_idx;
    }

    static class TestDataEmptyArray {
        public static int[] get_array() {
            return new int[0];
        }
    }

    static class TestDataUniqueValues {
        public static int[] get_array() {
            int[] arr = new int[2];
            arr[0]=0;
            arr[1]=1;
            return arr;
        }

        public static int get_expected_result() {
            return 0;
        }
    }

    static class TestDataExactlyTwoDifferentMinimums {
        public static int[] get_array() {
        	 int[] arr = new int[3];
             arr[0]=0;
             arr[1]=1;
             arr[2]=1;
             return arr;
        }

        public static int get_expected_result() {
            return 1;
        }
    }

}