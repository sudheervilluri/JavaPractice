import java.util.concurrent.CountDownLatch;

public class CountDownLatchExample {
	public static void main(String[] args) throws InterruptedException {
		CountDownLatch cd = new CountDownLatch(3);
		ThreadClass3 td = new ThreadClass3("test", cd);
		Thread td2 = new Thread(td);
		td2.start();
		ThreadClass3 td3 = new ThreadClass3("test2", cd);
		Thread t = new Thread(td3);
		t.start();
		
		ThreadClass3 td4 = new ThreadClass3("test2", cd);
		new Thread(td4).start();
		
		ThreadClass3 td5 = new ThreadClass3("test2", cd);
		new Thread(td5).start();
		cd.await();
		
	}

}

class ThreadClass3 implements Runnable{

	private String value ;
	private CountDownLatch blockingQueue =null;
	
	public ThreadClass3(String value,CountDownLatch blockingQueue) {
		this.value = value;
		this.blockingQueue = blockingQueue;
	}
	
	@Override
	public void run() {
		for (int i = 1; i <=3; i++) {
			 try {
			  System.out.println("Fetching "+i+" data from "+value+" by "+Thread.currentThread().getName());
		 
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} // Reading file
		  
		   System.out.println("Read file successfully: "+value+" by "+Thread.currentThread().getName());
		}
	}

}

