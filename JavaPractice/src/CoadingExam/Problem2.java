package CoadingExam;

import java.util.HashMap;

public class Problem2 {

	public int[] twoSum(int[] nums, int target) {
		HashMap<Integer, Integer> nm = new HashMap();
		int[] ar = new int[2];
		for (int i = 0; i < nums.length; i++) {
			if (nm.get(target - nums[i]) != null) {
				ar[0] = nm.get(target - nums[i]);
				ar[1] = i;
				return ar;
			}
			if (nm.get(target - nums[i]) == null) {
				nm.put(nums[i], i);
			}
		}
		return ar;
	}
}

/**
 * Given an array of integers, return indices of the two numbers such that they add up to a specific target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:

Given nums = [2, 7, 11, 15], target = 9,

Because nums[0] + nums[1] = 2 + 7 = 9,
return [0, 1].
*/